import { makeAnswer } from "test/factories/make-answer.js";
import { makeAnswerComment } from "test/factories/make-answer-comment.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository.js";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository.js";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository.js";
import { SendNotificationUseCase } from "../use-cases/send-notification.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository.js";
import { makeQuestion } from "test/factories/make-question.js";
import type { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for.js";
import { OnAnswerCommentCreated } from "./on-answer-comment-created.js";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe("On Answer Comment Created", () => {
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

    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    // eslint-disable-next-line no-new -- efeito colateral pretendido (registra o subscriber)
    new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    );
  });

  it("Should send a notification when an answer comment is created", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });
    const answerComment = makeAnswerComment({ answerId: answer.id });

    inMemoryQuestionRepository.create(question);
    inMemoryAnswersRepository.create(answer);
    inMemoryAnswerCommentsRepository.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
