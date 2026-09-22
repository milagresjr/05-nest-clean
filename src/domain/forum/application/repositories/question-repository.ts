import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import { Question } from "../../enterprise/entities/question.js";

export abstract class QuestionRepository {
  abstract findById(questionId: string): Promise<Question | null>;
  abstract create(question: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecents(params: PaginationParams): Promise<Question[]>;
  abstract delete(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
}
