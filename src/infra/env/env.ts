import z from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  DATABASE_POOL_MAX: z.coerce.number().default(20),
  DATABASE_POOL_MIN: z.coerce.number().default(5),
  DATABASE_POOL_IDLE_TIMEOUT_MS: z.coerce.number().default(30000),
  DATABASE_POOL_CONNECTION_TIMEOUT_MS: z.coerce.number().default(2000),
  DATABASE_POOL_MAX_USES: z.coerce.number().default(10000),
});

export type Env = z.infer<typeof envSchema>;
