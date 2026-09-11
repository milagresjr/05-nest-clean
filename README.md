# 05-nest-clean

API de fórum construída com **NestJS** e arquitetura limpa (DDD), com **Prisma** e **PostgreSQL**.

## Requisitos

- Node.js >= 20 (`.nvmrc` recomenda `24`)
- npm
- Docker (para o PostgreSQL)

## Primeiros passos (máquina nova)

```bash
# 1. Clonar e entrar na pasta
git clone https://github.com/milagresjr/05-nest-clean.git
cd 05-nest-clean

# 2. Instalar dependências
npm install

# 3. Gerar chaves JWT e criar .env / .env.test a partir dos exemplos
npm run setup

# 4. Subir o banco de dados (compose.yaml)
docker compose up -d

# 5. Gerar o client do Prisma (generated/ não vai para o git)
npm run prisma:generate

# 6. Aplicar as migrations no banco de dev
npm run prisma:migrate        # ou: npm run prisma:deploy

# 7. Rodar em modo watch
npm run start:dev             # http://localhost:3333
```

### Alternativa manual ao `npm run setup`

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
cp .env.example .env
cp .env.test.example .env.test
# Preencher JWT_PRIVATE_KEY e JWT_PUBLIC_KEY com o conteúdo em base64 das chaves:
#   base64 -w0 private.pem
#   base64 -w0 public.pem
```

> As chaves JWT são lidas como **base64** (`Buffer.from(key, "base64")`). Não use o PEM puro.

## Testes

- Unitários: `npm test`
- E2E (requer banco de teste): `npm run test:e2e`

Antes dos e2e, crie o banco de teste (a URL `.env.test` precisa conter `nest-clean-test`):

```bash
docker compose exec postgres createdb -U postgres nest-clean-test
```

## Scripts úteis

| Script | Descrição |
| --- | --- |
| `npm run start:dev` | Sobe o servidor em modo watch |
| `npm run build` | Compila para `dist/` |
| `npm run setup` | Gera chaves RSA e cria `.env`/`.env.test` |
| `npm run prisma:generate` | Gera o client Prisma em `generated/` |
| `npm run prisma:migrate` | Aplica migrations (dev) |
| `npm run prisma:deploy` | Aplica migrations (produção) |
| `npm test` / `npm run test:e2e` | Testes unitários / e2e |

## Estrutura

```
src/
├── core/            # entidades, eventos e erros compartilhados
├── domain/          # lógica de domínio (forum, notification)
└── infra/           # NestJS: controllers, auth, Prisma
```

## Observações

- `generated/`, `.env`, `.env.test` e `*.pem` são ignorados pelo git — sempre rode `npm run setup` e `npm run prisma:generate` após clonar.
- O alias `@/*` (mapeado para `src/*`) é resolvido em runtime por `tsconfig-paths.register.js` (carregado pelos scripts de `start` via `NODE_OPTIONS`).