import { Question } from "../../enterprise/entities/question.js";
import { QuestionRepository } from "../repositories/question-repository.js";
import { right, type Either } from "@/core/either.js";
import { Inject, Injectable } from "@nestjs/common";

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecents({ page });

    return right({ questions });
  }
}
