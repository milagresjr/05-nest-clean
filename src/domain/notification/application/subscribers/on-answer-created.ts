import { DomainEvents } from "@/core/events/domain-events.js";
import type { DomainEvent } from "@/core/events/domain-event.js";
import type { EventHandler } from "@/core/events/event-handler.js";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event.js";
import type { QuestionRepository } from "@/domain/forum/application/repositories/question-repository.js";
import type { SendNotificationUseCase } from "../use-cases/send-notification.js";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification(event: DomainEvent) {
    const { answer } = event as AnswerCreatedEvent;
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat("...")}"`,
        content: answer.excerpt,
      });
    }
  }
}
