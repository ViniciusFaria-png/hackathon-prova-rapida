import { db } from '../../lib/db';
import { AddQuestionToExamDTO, CreateExamDTO, ExamVersion, ExamVersionWithQuestions, ExamWithQuestions, FindExamsFilters, IExamRepository, PaginatedResult, UpdateExamDTO } from '../interfaces/exam-repository.interface';

export class PGExamRepository implements IExamRepository {
    async findAllByUserId(userId: string, filters?: FindExamsFilters): Promise<PaginatedResult<any>> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;
        
        let query = `SELECT e.*, 
            (SELECT COUNT(*) FROM exam_questions eq WHERE eq.exam_id = e.id) as question_count,
            (SELECT COUNT(*) FROM exam_versions ev WHERE ev.exam_id = e.id AND ev.status = 'finalized') as finalized_versions
            FROM exams e WHERE e.user_id = $1`;
        const params: any[] = [userId];
        let paramCount = 2;

        if (filters?.subject) {
            query += ` AND e.subject = $${paramCount++}`;
            params.push(filters.subject);
        }
        if (filters?.search) {
            query += ` AND e.title ILIKE $${paramCount++}`;
            params.push(`%${filters.search}%`);
        }
        if (filters?.status === 'finalized') {
            query += ` AND EXISTS (SELECT 1 FROM exam_versions ev WHERE ev.exam_id = e.id AND ev.status = 'finalized')`;
        } else if (filters?.status === 'draft') {
            query += ` AND NOT EXISTS (SELECT 1 FROM exam_versions ev WHERE ev.exam_id = e.id AND ev.status = 'finalized')`;
        }

        const countQuery = query.replace(/SELECT e\.\*.*FROM exams e/, 'SELECT COUNT(*) FROM exams e');
        const countResult = await db.query(countQuery, params);
        const total = Number.parseInt(countResult.rows[0].count, 10);

        query += ` ORDER BY e.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        return {
            data: result.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string): Promise<ExamWithQuestions | null> {
        const examResult = await db.query(
            `SELECT * FROM exams WHERE id = $1`,
            [id]
        );

        if (examResult.rows.length === 0) {
            return null;
        }

        const exam = examResult.rows[0];

        const questionsResult = await db.query(
            `SELECT 
                q.id, q.statement, q.subject,
                eq.position,
                a.id as alt_id, a.text as alt_text, a.is_correct as alt_is_correct
            FROM exam_questions eq
            JOIN questions q ON q.id = eq.question_id
            LEFT JOIN alternatives a ON a.question_id = q.id
            WHERE eq.exam_id = $1
            ORDER BY eq.position ASC, a.id ASC`,
            [id]
        );

        const questionsMap = new Map();
        
        for (const row of questionsResult.rows) {
            if (!questionsMap.has(row.id)) {
                questionsMap.set(row.id, {
                    id: row.id,
                    statement: row.statement,
                    subject: row.subject,
                    position: row.position,
                    alternatives: []
                });
            }
            
            if (row.alt_id) {
                questionsMap.get(row.id).alternatives.push({
                    id: row.alt_id,
                    text: row.alt_text,
                    is_correct: row.alt_is_correct
                });
            }
        }

        return {
            ...exam,
            questions: Array.from(questionsMap.values())
        };
    }

    async create(data: CreateExamDTO) {
        const result = await db.query(
            'INSERT INTO exams (title, subject, user_id) VALUES ($1, $2, $3) RETURNING id',
            [data.title, data.subject, data.userId]
        );
        return { id: result.rows[0].id };
    }

    async update(id: string, data: UpdateExamDTO): Promise<void> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.title !== undefined) {
            updates.push(`title = $${paramCount++}`);
            values.push(data.title);
        }
        if (data.subject !== undefined) {
            updates.push(`subject = $${paramCount++}`);
            values.push(data.subject);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        await db.query(
            `UPDATE exams SET ${updates.join(', ')} WHERE id = $${paramCount}`,
            values
        );
    }

    async delete(id: string): Promise<void> {
        await db.query('DELETE FROM exams WHERE id = $1', [id]);
    }

    async addQuestion(data: AddQuestionToExamDTO): Promise<void> {
        await db.query(
            `INSERT INTO exam_questions (exam_id, question_id, position) 
             VALUES ($1, $2, $3)
             ON CONFLICT (exam_id, question_id) DO UPDATE SET position = $3`,
            [data.examId, data.questionId, data.position]
        );
    }

    async removeQuestion(examId: string, questionId: string): Promise<void> {
        await db.query(
            'DELETE FROM exam_questions WHERE exam_id = $1 AND question_id = $2',
            [examId, questionId]
        );
    }

    async reorderQuestions(examId: string, questionOrders: Array<{ questionId: string; position: number }>): Promise<void> {
        const client = await db['pool'].connect();
        try {
            await client.query('BEGIN');

            for (const { questionId, position } of questionOrders) {
                await client.query(
                    'UPDATE exam_questions SET position = $1 WHERE exam_id = $2 AND question_id = $3',
                    [position, examId, questionId]
                );
            }

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async duplicate(examId: string, userId: string, newTitle: string): Promise<{ id: string }> {
        const client = await db['pool'].connect();
        try {
            await client.query('BEGIN');

            const examResult = await client.query(
                'SELECT title, subject FROM exams WHERE id = $1',
                [examId]
            );

            if (examResult.rows.length === 0) {
                throw new Error('Exam not found');
            }

            const originalExam = examResult.rows[0];

            const newExamResult = await client.query(
                'INSERT INTO exams (title, subject, user_id) VALUES ($1, $2, $3) RETURNING id',
                [newTitle || `${originalExam.title} (Cópia)`, originalExam.subject, userId]
            );

            const newExamId = newExamResult.rows[0].id;

            await client.query(
                `INSERT INTO exam_questions (exam_id, question_id, position)
                 SELECT $1, question_id, position
                 FROM exam_questions
                 WHERE exam_id = $2`,
                [newExamId, examId]
            );

            await client.query('COMMIT');
            return { id: newExamId };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async createVersion(examId: string, versionName: string, shuffleSeed: number, questionPositions: Array<{ questionId: string; position: number }>, status: string = 'draft'): Promise<{ id: string }> {
        const client = await db['pool'].connect();
        try {
            await client.query('BEGIN');

            const versionResult = await client.query(
                'INSERT INTO exam_versions (exam_id, version_name, shuffle_seed, status) VALUES ($1, $2, $3, $4) RETURNING id',
                [examId, versionName, shuffleSeed, status]
            );

            const versionId = versionResult.rows[0].id;

            for (const { questionId, position } of questionPositions) {
                await client.query(
                    'INSERT INTO exam_version_questions (version_id, question_id, position) VALUES ($1, $2, $3)',
                    [versionId, questionId, position]
                );
            }

            await client.query('COMMIT');
            return { id: versionId };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async findVersionsByExamId(examId: string): Promise<ExamVersion[]> {
        const result = await db.query(
            'SELECT * FROM exam_versions WHERE exam_id = $1 ORDER BY created_at DESC',
            [examId]
        );
        return result.rows;
    }

    async findVersionById(versionId: string): Promise<ExamVersionWithQuestions | null> {
        const versionResult = await db.query(
            `SELECT ev.*, e.title as exam_title, e.subject as exam_subject
             FROM exam_versions ev
             JOIN exams e ON e.id = ev.exam_id
             WHERE ev.id = $1`,
            [versionId]
        );

        if (versionResult.rows.length === 0) return null;

        const version = versionResult.rows[0];

        const questionsResult = await db.query(
            `SELECT 
                q.id, q.statement, q.subject,
                evq.position,
                a.id as alt_id, a.text as alt_text, a.is_correct as alt_is_correct
            FROM exam_version_questions evq
            JOIN questions q ON q.id = evq.question_id
            LEFT JOIN alternatives a ON a.question_id = q.id
            WHERE evq.version_id = $1
            ORDER BY evq.position ASC, a.id ASC`,
            [versionId]
        );

        const questionsMap = new Map();
        for (const row of questionsResult.rows) {
            if (!questionsMap.has(row.id)) {
                questionsMap.set(row.id, {
                    id: row.id,
                    statement: row.statement,
                    subject: row.subject,
                    position: row.position,
                    alternatives: []
                });
            }
            if (row.alt_id) {
                questionsMap.get(row.id).alternatives.push({
                    id: row.alt_id,
                    text: row.alt_text,
                    is_correct: row.alt_is_correct
                });
            }
        }

        return {
            id: version.id,
            exam_id: version.exam_id,
            version_name: version.version_name,
            shuffle_seed: version.shuffle_seed,
            status: version.status,
            created_at: version.created_at,
            questions: Array.from(questionsMap.values())
        };
    }

    async finalizeVersion(versionId: string): Promise<void> {
        await db.query(
            "UPDATE exam_versions SET status = 'finalized' WHERE id = $1",
            [versionId]
        );
    }

    async getExamStats(examId: string): Promise<{
        totalQuestions: number;
        totalVersions: number;
        subjects: string[];
        createdAt: Date;
        lastModified: Date;
    }> {
        const examResult = await db.query(
            'SELECT created_at, updated_at FROM exams WHERE id = $1',
            [examId]
        );

        if (examResult.rows.length === 0) {
            throw new Error('Exam not found');
        }

        const questionsResult = await db.query(
            `SELECT COUNT(*) as count, array_agg(DISTINCT q.subject) as subjects
             FROM exam_questions eq
             JOIN questions q ON q.id = eq.question_id
             WHERE eq.exam_id = $1`,
            [examId]
        );

        const versionsResult = await db.query(
            'SELECT COUNT(*) as count FROM exam_versions WHERE exam_id = $1',
            [examId]
        );

        return {
            totalQuestions: Number.parseInt(questionsResult.rows[0].count, 10),
            totalVersions: Number.parseInt(versionsResult.rows[0].count, 10),
            subjects: questionsResult.rows[0].subjects?.filter(Boolean) || [],
            createdAt: examResult.rows[0].created_at,
            lastModified: examResult.rows[0].updated_at,
        };
    }

    async isExamFinalized(examId: string): Promise<boolean> {
        const result = await db.query(
            "SELECT COUNT(*) as count FROM exam_versions WHERE exam_id = $1 AND status = 'finalized'",
            [examId]
        );
        return Number.parseInt(result.rows[0].count, 10) > 0;
    }

    async getQuestionExamUsage(questionId: string): Promise<Array<{ examId: string; status: string }>> {
        const result = await db.query(
            `SELECT eq.exam_id, 
                    CASE WHEN EXISTS (
                        SELECT 1 FROM exam_versions ev WHERE ev.exam_id = eq.exam_id AND ev.status = 'finalized'
                    ) THEN 'finalized' ELSE 'draft' END as status
             FROM exam_questions eq
             WHERE eq.question_id = $1`,
            [questionId]
        );
        return result.rows.map(r => ({ examId: r.exam_id, status: r.status }));
    }
}