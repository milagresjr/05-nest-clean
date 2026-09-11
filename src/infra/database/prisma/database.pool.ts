import { Pool } from "pg";

function parseIntEnv(
  value: string | undefined,
  fallback: number,
  min = 0,
): number {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= min ? parsed : fallback;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL não definido. Verifique se o .env foi carregado.",
  );
}

export const databasePool = new Pool({
  connectionString,
  max: parseIntEnv(process.env.DATABASE_POOL_MAX, 20, 1),
  min: parseIntEnv(process.env.DATABASE_POOL_MIN, 5),
  idleTimeoutMillis: parseIntEnv(
    process.env.DATABASE_POOL_IDLE_TIMEOUT_MS,
    30_000,
  ),
  connectionTimeoutMillis: parseIntEnv(
    process.env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
    2_000,
  ),
  maxUses: parseIntEnv(process.env.DATABASE_POOL_MAX_USES, 10_000, 1),
});
