import { db } from '../../lib/db';
import { CreateAlternativeDTO, IAlternativeRepository, UpdateAlternativeDTO } from '../alternative-repository.interface';

export class PGAlternativeRepository implements IAlternativeRepository {
    async create(data: CreateAlternativeDTO): Promise<{ id: string }> {
        const result = await db.query(
            'INSERT INTO alternatives (text, is_correct, question_id) VALUES ($1, $2, $3) RETURNING id',
            [data.text, data.isCorrect, data.questionId]
        );
        return { id: result.rows[0].id };
    }

    async findById(id: string): Promise<any> {
        const result = await db.query(
            'SELECT * FROM alternatives WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async update(id: string, data: UpdateAlternativeDTO): Promise<void> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (data.text !== undefined) {
            updates.push(`text = $${paramCount++}`);
            values.push(data.text);
        }
        if (data.isCorrect !== undefined) {
            updates.push(`is_correct = $${paramCount++}`);
            values.push(data.isCorrect);
        }

        if (updates.length === 0) return;

        values.push(id);

        await db.query(
            `UPDATE alternatives SET ${updates.join(', ')} WHERE id = $${paramCount}`,
            values
        );
    }

    async delete(id: string): Promise<void> {
        await db.query('DELETE FROM alternatives WHERE id = $1', [id]);
    }
}
