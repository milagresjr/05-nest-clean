import type { Answer } from "../../enterprise/entities/answer.js";
import type { AnswerRepository } from "../repositories/answer-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error.js";
import type { AnswerAttachmentRepository } from "../repositories/answer-attachment-repository.js";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list.js";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentRepository: AnswerAttachmentRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answerRepository.save(answer);

    return right({
      answer,
    });
  }
}
