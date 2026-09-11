#!/usr/bin/env node
// Gera um par de chaves RSA e cria `.env` e `.env.test` a partir dos exemplos
// (`.env.example` e `.env.test.example`), caso ainda não existam.
// Arquivos existentes NUNCA são sobrescritos.
import { generateKeyPairSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const publicKeyBase64 = Buffer.from(
  publicKey.export({ type: "spki", format: "pem" }),
).toString("base64");

const privateKeyBase64 = Buffer.from(
  privateKey.export({ type: "pkcs8", format: "pem" }),
).toString("base64");

function writeIfMissing(filePath, content) {
  if (existsSync(filePath)) {
    console.log(`[setup] ${path.basename(filePath)} já existe — mantendo.`);
    return false;
  }
  writeFileSync(filePath, content);
  console.log(`[setup] ${path.basename(filePath)} criado com sucesso.`);
  return true;
}

function createFromTemplate(templateName, targetName) {
  const templatePath = path.join(root, templateName);
  const targetPath = path.join(root, targetName);

  if (!existsSync(templatePath)) {
    console.warn(`[setup] Modelo ${templateName} não encontrado; pulando.`);
    return;
  }

  if (existsSync(targetPath)) {
    console.log(`[setup] ${targetName} já existe — mantendo.`);
    return;
  }

  const content = readFileSync(templatePath, "utf8")
    .replaceAll("CHANGE_ME_JWT_PRIVATE_KEY", privateKeyBase64)
    .replaceAll("CHANGE_ME_JWT_PUBLIC_KEY", publicKeyBase64);

  writeIfMissing(targetPath, content);
}

writeIfMissing(
  path.join(root, "private.pem"),
  privateKey.export({ type: "pkcs8", format: "pem" }),
);

writeIfMissing(
  path.join(root, "public.pem"),
  publicKey.export({ type: "spki", format: "pem" }),
);

createFromTemplate(".env.example", ".env");
createFromTemplate(".env.test.example", ".env.test");

console.log("");
console.log(
  "[setup] Pronto! Agora rode: npm install && npm run prisma:generate && npm run prisma:migrate && npm run start:dev",
);