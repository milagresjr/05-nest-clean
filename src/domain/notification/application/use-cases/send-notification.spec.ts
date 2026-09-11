import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository.js";
import { SendNotificationUseCase } from "./send-notification.js";

let sut: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

describe("Send Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("Should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "Nova notificacao",
      content: "Conteudo da notificacao!",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    );
  });
});
