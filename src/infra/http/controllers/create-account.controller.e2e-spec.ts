// Teste e2e do endpoint POST /accounts.
// Exercita a aplicação real (Nest app completo + banco de teste) via HTTP.
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("POST /accounts", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Cria a aplicação Nest de verdade (sem mocks).
    // O teste roda contra o banco de teste (nest-clean-test) via .env.test.
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    // Encerra o app para liberar conexões (prisma, http, etc.).
    await app.close();
  });

  it("should be able to create a new account", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "Milagres Junior",
      email: "milagres@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);

    // Confere que o usuário realmente foi persistido no banco de teste.
    const userOnDB = await prisma.user.findUnique({
      where: { email: "milagres@example.com" },
    });

    expect(userOnDB).toBeTruthy();
  });

  it("should not be able to create an account with a duplicate email", async () => {
    // Cria um usuário direto no banco para já existir antes do request.
    await prisma.user.create({
      data: {
        name: "Existing User",
        email: "existing@example.com",
        password: "123456",
      },
    });

    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "Another User",
      email: "existing@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(409);
  });
});
