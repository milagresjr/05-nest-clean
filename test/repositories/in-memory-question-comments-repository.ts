import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository.js";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment.js";
import { DomainEvents } from "@/core/events/domain-events.js";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComment = await this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComment;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );
    this.items.splice(questionCommentIndex, 1);
  }
}
