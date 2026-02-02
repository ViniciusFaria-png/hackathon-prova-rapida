import fs from 'node:fs';
import path from 'node:path';
import { Pool, PoolClient, QueryResult } from 'pg';
import { env } from '../env';

const CONFIG = env.ENV === "production" ? {
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
} : {
  user: env.POSTGRES_USER,
  host: env.POSTGRES_HOST || "localhost",
  database: env.POSTGRES_DB,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT || 5432,
  ssl: false,
};

class Database {
  private pool: Pool;
  private client: PoolClient | undefined;

  constructor() {
    this.pool = new Pool(CONFIG);
    this.connection();
  }

  private async connection() {
    try {
      this.client ??= await this.pool.connect();
      console.log("Conexão com o banco de dados estabelecida com sucesso.");
      
      if (env.ENV === "production") {
        console.log("Usando DATABASE_URL em produção");
      } else {
        console.log(`Conectado ao banco local: ${env.POSTGRES_HOST || 'localhost'}:${env.POSTGRES_PORT || 5432}`);
      }
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error);
      throw error;
    }
  }

  get clientInstance() {
    return this.client;
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    if (!this.client) {
      await this.connection();
    }
    if (!this.client) {
      throw new Error("Cliente do banco não está conectado.");
    }
    return this.client.query(text, params);
  }

  async init(): Promise<void> {
    const client = await this.pool.connect();
    try {
      const dbPath = path.resolve(__dirname, '../../db');
      const schemaPath = path.join(dbPath, '01-schema.sql');
      const seedsPath = path.join(dbPath, '02-seeds.sql');

      if (fs.existsSync(schemaPath)) {
        console.log(`Executando schema: ${schemaPath}`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log("Schema criado com sucesso!");
      } else {
        console.warn("Arquivo 01-schema.sql não encontrado!");
      }

      if (fs.existsSync(seedsPath)) {
        console.log(`Executando seeds: ${seedsPath}`);
        const seedsSql = fs.readFileSync(seedsPath, 'utf8');
        await client.query(seedsSql);
        console.log("Seeds inseridos com sucesso!");
      } else {
        console.warn("Arquivo 02-seeds.sql não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao iniciar banco de dados:", error);
    } finally {
      client.release();
    }
  }

  async close() {
    if (this.client) {
      this.client.release();
    }
    await this.pool.end();
  }
}

export const db = new Database();