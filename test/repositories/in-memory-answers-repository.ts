import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository.js";
import type { Answer } from "@/domain/forum/enterprise/entities/answer.js";
import type { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository.js";
import { DomainEvents } from "@/core/events/domain-events.js";

export class InMemoryAnswersRepository implements AnswerRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentRepository,
  ) {}

  async findById(answerId: string) {
    const answer = await this.items.find(
      (item) => item.id.toString() === answerId,
    );

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = await this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[answerIndex] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);
    this.items.splice(answerIndex, 1);

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
