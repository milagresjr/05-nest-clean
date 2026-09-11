import { makeQuestionComment } from "test/factories/make-question-comment.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository.js";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository.js";
import { SendNotificationUseCase } from "../use-cases/send-notification.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository.js";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository.js";
import { makeQuestion } from "test/factories/make-question.js";
import type { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for.js";
import { OnQuestionCommentCreated } from "./on-question-comment-created.js";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe("On Question Comment Created", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    );

    inMemoryNotificationRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    );

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    // eslint-disable-next-line no-new -- efeito colateral pretendido (registra o subscriber)
    new OnQuestionCommentCreated(
      inMemoryQuestionRepository,
      sendNotificationUseCase,
    );
  });

  it("Should send a notification when a question comment is created", async () => {
    const question = makeQuestion();
    const questionComment = makeQuestionComment({ questionId: question.id });

    inMemoryQuestionRepository.create(question);
    inMemoryQuestionCommentsRepository.create(questionComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
