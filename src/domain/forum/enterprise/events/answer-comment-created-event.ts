import type { DomainEvent } from "@/core/events/domain-event.js";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { AnswerComment } from "../entities/answer-comment.js";

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComment.id;
  }
}
