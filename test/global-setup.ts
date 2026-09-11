// Roda UMA vez, antes de todos os testes (no processo principal do Vitest).
// Garante que as migrations sejam aplicadas no banco de TESTE.
import dotenv from "dotenv";
import { execSync } from "node:child_process";

// Carrega o .env.test ANTES de qualquer coisa, para que o Prisma CLI
// e o app apontem para o banco de teste.
dotenv.config({ path: ".env.test" });

const testDatabaseUrl = process.env.DATABASE_URL;

// Guard de segurança: se por acaso o DATABASE_URL não for o banco de teste,
// abortamos a execução para nunca rodar testes contra o banco de dev.
if (!testDatabaseUrl?.includes("nest-clean-test")) {
  throw new Error(
    "DATABASE_URL deve apontar para o banco de TESTE (nest-clean-test). Verifique o .env.test.",
  );
}

export default function globalSetup() {
  // Aplica todas as migrations no banco de teste (deploy, não dev).
  // execSync herda o process.env, então o Prisma CLI mira na URL de teste.
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
  });
}
