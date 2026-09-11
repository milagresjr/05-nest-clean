import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository.js";
import { ReadNotificationUseCase } from "./read-notification.js";
import { makeNotification } from "test/factories/make-notification.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";

let sut: ReadNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

describe("Read Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("Should be able to read a notification", async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]?.readAt).toEqual(
      expect.any(Date),
    );
  });

  it("Should not be able to read a notification by another author", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId("recipient-1"),
    });

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: "notification-1",
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
