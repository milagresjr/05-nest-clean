// Teste e2e do endpoint POST /accounts.
// Exercita a aplicação real (Nest app completo + banco de teste) via HTTP.
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

describe("POST /questions", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    // Cria a aplicação Nest de verdade (sem mocks).
    // O teste roda contra o banco de teste (nest-clean-test) via .env.test.
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    // Encerra o app para liberar conexões (prisma, http, etc.).
    await app.close();
  });

  it("Should be able create a question", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Milagres Junior",
        email: "milagres@gmail.com",
        password: await hash("123456", 8),
      },
    });

    const token = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Nova pergunta",
        content: "Conteudo da nova pergunta",
      });

    expect(response.statusCode).toBe(201);
  });

  it("should not be able to create a question without a token", async () => {
    await prisma.user.create({
      data: {
        name: "Milagres Junior",
        email: "milagres@gmail.com",
        password: await hash("123456", 8),
      },
    });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .send({
        title: "Nova pergunta",
        content: "Conteudo da nova pergunta",
      });

    expect(response.statusCode).toBe(401);
  });
});
