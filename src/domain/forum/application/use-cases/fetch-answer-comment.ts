import type { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { right, type Either } from "@/core/either.js";

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answersComment: AnswerComment[];
  }
>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answersComment =
      await this.answerCommentRepository.findManyByAnswerId(answerId, { page });

    return right({ answersComment });
  }
}
