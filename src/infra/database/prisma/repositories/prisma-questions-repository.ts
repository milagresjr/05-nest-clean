import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { QuestionRepository } from "@/domain/forum/application/repositories/question-repository.js";
import type { Question } from "@/domain/forum/enterprise/entities/question.js";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

Injectable();
export class PrismaQuestionsRepository implements QuestionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  create(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findBySlug(slug: string): Promise<Question | null> {
    throw new Error("Method not implemented.");
  }

  findManyRecents(params: PaginationParams): Promise<Question[]> {
    throw new Error("Method not implemented.");
  }

  delete(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }

  save(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
