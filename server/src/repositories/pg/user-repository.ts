import { User } from "../../entities/user-entity";
import { db } from "../../lib/db";
import { IUserRepository } from "../user-repository.interface";


export class UserRepository implements IUserRepository {
  async signin(email: string): Promise<User | null> {
    const result = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  async create(user: any): Promise<User> {
    const result = await db.query(
      `INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *`,
      [user.name, user.email, user.password]
    );

    return result.rows[0];
  }

  async findById(id: string | number): Promise<User | null> {
    const result = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async findAll(): Promise<User[]> {
    const result = await db.query(
      `SELECT * FROM users ORDER BY created_at DESC`
    );

    return result.rows || [];
  }

  async update(id: string | number, data: Partial<Omit<User, "id">>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.password !== undefined) {
      fields.push(`password = $${paramCount++}`);
      values.push(data.password);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string | number): Promise<void> {
    await db.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );
  }
}

