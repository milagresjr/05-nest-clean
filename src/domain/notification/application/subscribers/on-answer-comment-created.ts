import { DomainEvents } from "@/core/events/domain-events.js";
import type { EventHandler } from "@/core/events/event-handler.js";
import type { SendNotificationUseCase } from "../use-cases/send-notification.js";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository.js";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event.js";
import type { DomainEvent } from "@/core/events/domain-event.js";

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendAnswerCommentNotification(event: DomainEvent) {
    const { answerComment } = event as AnswerCommentCreatedEvent;

    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: "Novo comentário na sua resposta",
        content: `Você recebeu um novo comentário em uma das suas respostas.`,
      });
    }
  }
}
