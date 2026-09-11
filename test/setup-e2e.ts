// Roda em CADA worker de teste, antes do arquivo de spec ser importado.
// Importante: src/prisma/database.pool.ts lê DATABASE_URL no momento do import,
// por isso o env precisa estar pronto ANTES de qualquer import do app.
import dotenv from "dotenv";
import { Pool } from "pg";
import { afterAll, beforeEach } from "vitest";

dotenv.config({ path: ".env.test" });

const testDatabaseUrl = process.env.DATABASE_URL;

// Guard de segurança: aborta se o teste não estiver apontando para o banco de teste.
if (!testDatabaseUrl || !testDatabaseUrl.includes("nest-clean-test")) {
  throw new Error(
    "Os testes devem rodar no banco de TESTE (nest-clean-test). Confira o .env.test.",
  );
}

// Pool dedicado apenas para limpar as tabelas entre os testes.
const cleanupPool = new Pool({ connectionString: testDatabaseUrl });

// Busca dinamicamente todas as tabelas do schema 'public',
// exceto '_prisma_migrations' (histórico de migrations deve ser preservado).
async function listTableNames() {
  const { rows } = await cleanupPool.query<{ tablename: string }>(
    `SELECT tablename
       FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename != '_prisma_migrations'`,
  );

  return rows.map((row) => row.tablename);
}

// Limpa todas as tabelas (TRUNCATE é mais rápido que deleteMany e reseta os ids).
// Como a lista de tabelas é descoberta do banco, tabelas novas do Prisma
// são limpas automaticamente, sem precisar editar este arquivo.
export async function cleanDatabase() {
  const tables = await listTableNames();

  if (tables.length === 0) {
    return;
  }

  const tableList = tables.map((table) => `"${table}"`).join(", ");

  await cleanupPool.query(
    `TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`,
  );
}

// Fecha o pool após todos os testes do worker terminarem.
export async function closeDatabase() {
  await cleanupPool.end();
}

// Limpeza automática entre os testes: todo e2e spec começa com o banco zerado.
beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
