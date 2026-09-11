import type { DomainEvent } from "@/core/events/domain-event.js";
import type { Answer } from "../entities/answer.js";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id;
  }
}
