import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { Answer } from "../../../forum/enterprise/entities/answer.js";
import type { AnswerRepository } from "../repositories/answer-repository.js";
import { right, type Either } from "@/core/either.js";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment.js";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list.js";

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);

    return right({
      answer,
    });
  }
}
