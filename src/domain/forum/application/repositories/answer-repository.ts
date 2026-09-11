import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import { Answer } from "../../enterprise/entities/answer.js";

export interface AnswerRepository {
  findById(answerId: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  create(answer: Answer): Promise<void>;
  save(question: Answer): Promise<void>;
  delete(question: Answer): Promise<void>;
}
