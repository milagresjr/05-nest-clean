import type { DomainEvent } from "@/core/events/domain-event.js";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { QuestionComment } from "../entities/question-comment.js";

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public questionComment: QuestionComment;

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComment.id;
  }
}
