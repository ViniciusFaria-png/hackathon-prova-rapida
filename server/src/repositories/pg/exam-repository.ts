import { db } from "../../lib/db";
import { Exam } from "../exam-repository.interface";

export class ExamRepository {
  async create(exam: Exam): Promise<Exam> {
    const query = `
      INSERT INTO exams (title, subject, user_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [exam.title, exam.subject, exam.user_id];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByUserId(userId: number): Promise<Exam[]> {
    const query = `SELECT * FROM exams WHERE user_id = $1`;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

export const examRepository = new ExamRepository();