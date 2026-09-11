import { makeAnswer } from "test/factories/make-answer.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository.js";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository.js";
import { SendNotificationUseCase } from "../use-cases/send-notification.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository.js";
import { makeQuestion } from "test/factories/make-question.js";
import type { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for.js";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen.js";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryNotificationRepository: InMemoryNotificationsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNoficationExecuteSpy: MockInstance;

describe("On Questio Best Answer", () => {
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

    sendNoficationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    // eslint-disable-next-line no-new -- efeito colateral pretendido (registra o subscriber)
    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    );
  });

  it("Should send a notification when question has new best answer chosen", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    inMemoryQuestionRepository.save(question);

    await waitFor(() => {
      expect(sendNoficationExecuteSpy).toHaveBeenCalled();
    });
  });
});
