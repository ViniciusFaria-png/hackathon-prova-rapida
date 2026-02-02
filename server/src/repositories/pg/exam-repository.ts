import { db } from '../../lib/db';
import { AddQuestionToExamDTO, CreateExamDTO, ExamVersion, ExamWithQuestions, IExamRepository, UpdateExamDTO } from '../interfaces/exam-repository.interface';

export class PGExamRepository implements IExamRepository {
    async findAllByUserId(userId: string) {
        const result = await db.query(
            `SELECT * FROM exams WHERE user_id = $1 ORDER BY created_at DESC`, 
            [userId]
        );
        return result.rows;
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

        // Buscar questões com alternativas ordenadas por position
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

        // Agrupar questões e alternativas
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

            // Buscar prova original
            const examResult = await client.query(
                'SELECT title, subject FROM exams WHERE id = $1',
                [examId]
            );

            if (examResult.rows.length === 0) {
                throw new Error('Exam not found');
            }

            const originalExam = examResult.rows[0];

            // Criar nova prova
            const newExamResult = await client.query(
                'INSERT INTO exams (title, subject, user_id) VALUES ($1, $2, $3) RETURNING id',
                [newTitle || `${originalExam.title} (Cópia)`, originalExam.subject, userId]
            );

            const newExamId = newExamResult.rows[0].id;

            // Copiar questões
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

    async createVersion(examId: string, versionName: string, shuffleSeed: number, questionPositions: Array<{ questionId: string; position: number }>): Promise<{ id: string }> {
        const client = await db['pool'].connect();
        try {
            await client.query('BEGIN');

            const versionResult = await client.query(
                'INSERT INTO exam_versions (exam_id, version_name, shuffle_seed) VALUES ($1, $2, $3) RETURNING id',
                [examId, versionName, shuffleSeed]
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
}