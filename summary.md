# Project journal — 05-nest-clean (NestJS 11 + Prisma 7)

## Objective
Projeto em PT-BR: lint/format com aspas duplas + ponto-e-vírgula, JWT 401 consertado, Vitest e2e com DB dedicado, testes e2e passando e `tsc --noEmit` limpo.

## Important Details
- Prisma 7 + `@prisma/adapter-pg` ignora `?schema=` → DB separado `nest-clean-test` (não schema swap). E2E serial (`fileParallelism: false`).
- Vitest/SWC transpila sem checar tipos → `tsc --noEmit` pega erros latentes dos specs de domínio.
- Nest retorna **201** por padrão em `@POST`.
- `test:e2e` = `vitest run --config ./vitest.config.e2e.ts`; `npm test` = unit (`vitest run`).
- Guard de teste: env deve conter `nest-clean-test` (global-setup + setup-e2e).
- `no-new` e `no-void` vêm do eslint:recommended → `new` intencional para registrar subscribers usa `// eslint-disable-next-line no-new`.

## Work State
### Completed
- ESLint/Prettier: aspas duplas + semicolon (override `prettier/prettier`); `.eslintignore` com `data`.
- JWT 401: `jwt.strategy.ts` usa `Buffer.from(publicKey, "base64")` (aplicado pelo usuário).
- Vitest: `vitest.config.ts` + `vitest.config.e2e.ts` (swc + vite-tsconfig-paths).
- DB `nest-clean-test` criado; migrações aplicadas (users+questions, email unique).
- `test/global-setup.ts` (`.env.test` + `prisma migrate deploy`) e `test/setup-e2e.ts` (TRUNCATE dinâmico via pg_tables, beforeEach/afterAll). `.env.test` no `.gitignore`.
- `app.module.ts`: removido PrismaService duplicado nos providers.
- e2e (`create-account`, `authenticate`, `create-question`, `fetch-recent-questions`): **7/7 passando**.
- `create-question.controller.e2e-spec.ts`: usado `JwtService.sign({sub})` direto + teste 401 sem token (aplicado, junto com rename `TokenPayload → UserPayload` + `import type` nos controllers).
- Camada de domínio: lint limpo (removidos ~13 imports não usados; classes reordenadas em `domain-events.spec.ts`; `no-new` silenciado nos 4 subscriber specs). 23 arquivos / 35 testes passando.
- `fetch-recent-questions.controller.ts`: `perPage = 20` (watch out: paginação real) — spec GET /questions valida 2 perguntas.
- Validação final: lint ✓, `tsc --noEmit` ✓, `npm test` ✓, `npm run test:e2e` ✓.

### Active
- (nada — tudo resolvido/validado)

### Blocked
- (nenhum)

## Next Move
- Continuar do curso (ex.: próximos use-cases/controllers com e2e), mantendo padrões acima.

## Relevant Files
- `vitest.config.e2e.ts`, `vitest.config.ts`, `test/global-setup.ts`, `test/setup-e2e.ts`, `.env.test`
- `src/app.module.ts`, `src/auth/jwt.strategy.ts` (UserPayload), `src/auth/current-user-decorator.ts`
- e2e specs em `src/controllers/*.controller.e2e-spec.ts`
- `src/domain/forum/**, src/domain/notification/**, src/core/**` (specs + entidades)