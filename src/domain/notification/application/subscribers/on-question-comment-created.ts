import { DomainEvents } from "@/core/events/domain-events.js";
import type { EventHandler } from "@/core/events/event-handler.js";
import type { SendNotificationUseCase } from "../use-cases/send-notification.js";
import type { QuestionRepository } from "@/domain/forum/application/repositories/question-repository.js";
import { QuestionCommentCreatedEvent } from "@/domain/forum/enterprise/events/question-comment-created-event.js";
import type { DomainEvent } from "@/core/events/domain-event.js";

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    );
  }

  private async sendQuestionCommentNotification(event: DomainEvent) {
    const { questionComment } = event as QuestionCommentCreatedEvent;

    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: "Novo comentário na sua pergunta",
        content: `Você recebeu um novo comentário na pergunta "${question.title.substring(0, 40).concat("...")}"`,
      });
    }
  }
}
