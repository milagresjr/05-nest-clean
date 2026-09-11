// Teste e2e do endpoint POST /accounts.
// Exercita a aplicação real (Nest app completo + banco de teste) via HTTP.
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { AppModule } from "@/infra/app.module";

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

  it("Should be able for the user to authenticate.", async () => {
    await prisma.user.create({
      data: {
        name: "Milagres Junior2",
        email: "milagres@example.com",
        password: await hash("123456", 8),
      },
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "milagres@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });

  it("Should not be able for a user to authenticate with incorrect credentials.", async () => {
    // Cria um usuário direto no banco para já existir antes do request.
    await prisma.user.create({
      data: {
        name: "Milagres Junior2",
        email: "milagres@example.com",
        password: await hash("123456", 8),
      },
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "milagres22@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(401);
  });
});
