import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { Notification } from "../../enterprise/entities/notification.js";
import { right, type Either } from "@/core/either.js";
import type { NotificationRepository } from "../repositories/notification-repository.js";

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationRepository.create(notification);

    return right({
      notification,
    });
  }
}
