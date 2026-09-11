import type { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository.js";
import type { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment.js";

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentRepository {
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    );

    return answerAttachments;
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    );

    this.items = answerAttachments;
  }
}
