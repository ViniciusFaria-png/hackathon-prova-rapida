import fs from 'fs';
import path from 'path';
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
      if (process.env.NODE_ENV !== 'production') {
        const sqlPath = path.resolve(__dirname, '../../db/init.sql');
        
        console.log(`Lendo schema do banco de: ${sqlPath}`);

        if (fs.existsSync(sqlPath)) {
          const sql = fs.readFileSync(sqlPath, 'utf8');
          await client.query(sql);
          console.log("Schema do banco verificado/criado com sucesso!");
        } else {
          console.warn("Arquivo init.sql não encontrado!");
        }
      } else {
        console.log("Produção: assumindo que o banco já está configurado");
      }
    } catch (error) {
      console.error("Erro ao iniciar banco de dados:", error);
    } finally {
      client.release();
    }
  }
}

export const db = new Database();