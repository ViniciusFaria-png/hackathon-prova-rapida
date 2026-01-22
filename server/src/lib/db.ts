import fs from 'node:fs';
import path from 'node:path';
import { Pool, PoolClient, QueryResult } from 'pg';

class Database {
  private pool: Pool;
  private client: PoolClient | undefined;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  async init(): Promise<void> {
    const client = await this.pool.connect();
    try {
      const sqlPath = path.join(__dirname, '../../database/init.sql');

      if (fs.existsSync(sqlPath)) {
          const sql = fs.readFileSync(sqlPath, 'utf8');
          await client.query(sql);
          console.log("📦 Banco de dados inicializado!");
      }
    } catch (error) {
      console.error("Erro no banco:", error);
    } finally {
      client.release();
    }
  }
}

export const db = new Database();