// Teste e2e do endpoint GET /questions.
// Exercita a aplicação real (Nest app completo + banco de teste) via HTTP.
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "node:crypto";

describe("GET /questions", () => {
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

  it("Should be able to fetch recent questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Milagres Junior",
        email: "milagres@gmail.com",
        password: await hash("123456", 8),
      },
    });

    const userId = user.id;

    const token = jwt.sign({ sub: userId });

    await prisma.question.createMany({
      data: [
        {
          title: `Question title 1`,
          content: `Question content 1`,
          slug: randomUUID(),
          authorId: userId,
        },
        {
          title: `Question title 2`,
          content: `Question content 2`,
          slug: randomUUID(),
          authorId: userId,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: expect.any(Array),
    });
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: "Question title 1" }),
        expect.objectContaining({ title: "Question title 2" }),
      ],
    });
  });
});
