#!/usr/bin/env node
// Popula o banco de DESENVOLVIMENTO com dados de exemplo
// (usuários + perguntas), de forma idempotente.
// Uso: npm run db:seed
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import pg from "pg";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("[seed] DATABASE_URL não encontrado. Crie o .env com `npm run setup`.");
  process.exit(1);
}

if (url.includes("nest-clean-test")) {
  console.error("[seed] Nunca rode o seed no banco de TESTE. Confira o .env.");
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: url });

const PASSWORD = "123456";

const users = [
  { name: "John Doe", email: "john.doe@example.com" },
  { name: "Jane Doe", email: "jane.doe@example.com" },
];

const questions = [
  {
    title: "Como funciona o Clean Architecture no NestJS?",
    slug: "como-funciona-o-clean-architecture-no-nestjs",
    content:
      "Estou começando com DDD e queria entender como organizar use cases, entidades e controllers no NestJS.",
    authorEmail: "john.doe@example.com",
  },
  {
    title: "Qual a melhor forma de lidar com autenticação JWT?",
    slug: "qual-a-melhor-forma-de-lidar-com-autenticacao-jwt",
    content: "Estou usando RS256 e gostaria de saber boas práticas para segurança das chaves.",
    authorEmail: "john.doe@example.com",
  },
  {
    title: "Prisma com driver adapters: vale a pena usar o adapter-pg?",
    slug: "prisma-com-driver-adapters-vale-a-pena-usar-o-adapter-pg",
    content: "Vejo que dá para usar um Pool do pg diretamente. Quais as vantagens?",
    authorEmail: "jane.doe@example.com",
  },
];

let usersCreated = 0;
let questionsCreated = 0;

async function main() {
  const passwordHashed = await hash(PASSWORD, 8);
  const userIds = new Map();

  for (const user of users) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]);
    if (existing.rows.length > 0) {
      userIds.set(user.email, existing.rows[0].id);
      console.log(`[seed] usuário já existente: ${user.email}`);
      continue;
    }

    const id = randomUUID();
    await pool.query(
      `INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)`,
      [id, user.name, user.email, passwordHashed],
    );
    userIds.set(user.email, id);
    usersCreated += 1;
    console.log(`[seed] usuário criado: ${user.email}`);
  }

  for (const question of questions) {
    const authorId = userIds.get(question.authorEmail);
    if (!authorId) {
      console.warn(`[seed] autor ${question.authorEmail} não existe; pulando pergunta.`);
      continue;
    }

    const existing = await pool.query("SELECT id FROM questions WHERE slug = $1", [question.slug]);
    if (existing.rows.length > 0) {
      console.log(`[seed] pergunta já existente: ${question.slug}`);
      continue;
    }

    await pool.query(
      `INSERT INTO questions (id, title, slug, content, created_at, author_id)
       VALUES ($1, $2, $3, $4, now(), $5)`,
      [randomUUID(), question.title, question.slug, question.content, authorId],
    );
    questionsCreated += 1;
    console.log(`[seed] pergunta criada: ${question.slug}`);
  }

  console.log("");
  console.log(
    `[seed] Resumo: ${usersCreated} usuários e ${questionsCreated} perguntas criados. Senha padrão: "${PASSWORD}"`,
  );
}

main()
  .catch((error) => {
    console.error("[seed] Falha ao rodar o seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });