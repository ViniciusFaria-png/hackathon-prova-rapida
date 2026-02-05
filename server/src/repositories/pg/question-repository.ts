import { db } from '../../lib/db';
import { CreateQuestionDTO, FindQuestionsFilters, IQuestionRepository, QuestionWithAlternatives, UpdateQuestionDTO } from '../question-repository.interface';

export class PGQuestionRepository implements IQuestionRepository {
    async create(data: CreateQuestionDTO): Promise<{ id: string }> {
        const client = await db['pool'].connect();
        try {
            await client.query('BEGIN');

            const questionResult = await client.query(
                `INSERT INTO questions (statement, subject, user_id, is_public) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [data.statement, data.subject, data.userId || null, data.isPublic]
            );

            const questionId = questionResult.rows[0].id;

            for (const alt of data.alternatives) {
                await client.query(
                    'INSERT INTO alternatives (text, is_correct, question_id) VALUES ($1, $2, $3)',
                    [alt.text, alt.isCorrect, questionId]
                );
            }

            await client.query('COMMIT');
            return { id: questionId };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async findAll(filters: FindQuestionsFilters): Promise<QuestionWithAlternatives[]> {
        let query = `
            SELECT 
                q.id, q.statement, q.subject, q.user_id, q.is_public, q.created_at, q.updated_at,
                a.id as alt_id, a.text as alt_text, a.is_correct as alt_is_correct
            FROM questions q
            LEFT JOIN alternatives a ON a.question_id = q.id
            WHERE 1=1
        `;
        const params: any[] = [];
        let paramCount = 1;

        if (filters.subject) {
            query += ` AND q.subject = $${paramCount++}`;
            params.push(filters.subject);
        }

        if (filters.search) {
            query += ` AND q.statement ILIKE $${paramCount++}`;
            params.push(`%${filters.search}%`);
        }

        if (filters.userId) {
            query += ` AND q.user_id = $${paramCount++}`;
            params.push(filters.userId);
        }

        if (filters.isPublic !== undefined) {
            query += ` AND q.is_public = $${paramCount++}`;
            params.push(filters.isPublic);
        }

        query += ` ORDER BY q.created_at DESC, a.id ASC`;

        const result = await db.query(query, params);

        // Agrupar questões e alternativas
        const questionsMap = new Map<string, QuestionWithAlternatives>();

        for (const row of result.rows) {
            if (!questionsMap.has(row.id)) {
                questionsMap.set(row.id, {
                    id: row.id,
                    statement: row.statement,
                    subject: row.subject,
                    user_id: row.user_id,
                    is_public: row.is_public,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    alternatives: []
                });
            }

            if (row.alt_id) {
                questionsMap.get(row.id)!.alternatives.push({
                    id: row.alt_id,
                    text: row.alt_text,
                    is_correct: row.alt_is_correct
                });
            }
        }

        return Array.from(questionsMap.values());
    }

    async findById(id: string): Promise<QuestionWithAlternatives | null> {
        const result = await db.query(
            `SELECT 
                q.id, q.statement, q.subject, q.user_id, q.is_public, q.created_at, q.updated_at,
                a.id as alt_id, a.text as alt_text, a.is_correct as alt_is_correct
            FROM questions q
            LEFT JOIN alternatives a ON a.question_id = q.id
            WHERE q.id = $1
            ORDER BY a.id ASC`,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const question: QuestionWithAlternatives = {
            id: result.rows[0].id,
            statement: result.rows[0].statement,
            subject: result.rows[0].subject,
            user_id: result.rows[0].user_id,
            is_public: result.rows[0].is_public,
            created_at: result.rows[0].created_at,
            updated_at: result.rows[0].updated_at,
            alternatives: []
        };

        for (const row of result.rows) {
            if (row.alt_id) {
                question.alternatives.push({
                    id: row.alt_id,
                    text: row.alt_text,
                    is_correct: row.alt_is_correct
                });
            }
        }

        return question;
    }

    async update(id: string, data: UpdateQuestionDTO): Promise<void> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.statement !== undefined) {
            updates.push(`statement = $${paramCount++}`);
            values.push(data.statement);
        }
        if (data.subject !== undefined) {
            updates.push(`subject = $${paramCount++}`);
            values.push(data.subject);
        }
        if (data.isPublic !== undefined) {
            updates.push(`is_public = $${paramCount++}`);
            values.push(data.isPublic);
        }

        if (updates.length === 0) return;

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        await db.query(
            `UPDATE questions SET ${updates.join(', ')} WHERE id = $${paramCount}`,
            values
        );
    }

    async delete(id: string): Promise<void> {
        await db.query('DELETE FROM questions WHERE id = $1', [id]);
    }
}
