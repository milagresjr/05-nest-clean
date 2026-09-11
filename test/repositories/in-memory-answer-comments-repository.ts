import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository.js";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment.js";
import { DomainEvents } from "@/core/events/domain-events.js";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComment = await this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComment;
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );
    this.items.splice(answerCommentIndex, 1);
  }
}
