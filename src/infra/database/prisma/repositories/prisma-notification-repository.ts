import { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  findById(id: string): Promise<Notification | null> {
    throw new Error("Method not implemented.");
  }

  create(notification: Notification): Promise<void> {
    throw new Error("Method not implemented.");
  }

  save(notification: Notification): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
