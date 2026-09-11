import type { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository.js";
import type { Notification } from "@/domain/notification/enterprise/entities/notification.js";

export class InMemoryNotificationsRepository implements NotificationRepository {
  public items: Notification[] = [];

  async findById(notificationId: string): Promise<Notification | null> {
    const notification = await this.items.find(
      (item) => item.id.toString() === notificationId,
    );

    if (!notification) {
      return null;
    }

    return notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );

    this.items[notificationIndex] = notification;
  }
}
