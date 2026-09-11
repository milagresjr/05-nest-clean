import { makeQuestion } from "test/factories/make-question.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { makeAnswer } from "test/factories/make-answer.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository.js";
import { DeleteAnswerUseCase } from "./delete-answer.js";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachment-repository.js";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachment-repository.js";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      new InMemoryQuestionAttachmentsRepository(),
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new DeleteAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    );
  });

  it("Should be able to delete a answer by id", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("author-1"),
        questionId: new UniqueEntityId("question-1"),
      },
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    const result = await sut.execute({
      authorId: "author-1",
      answerId: "answer-1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items.length).toEqual(0);
    expect(inMemoryAnswerAttachmentsRepository.items.length).toEqual(0);
  });

  it("Should not be able to delete a answer by another author", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("author-1"),
        questionId: new UniqueEntityId("question-1"),
      },
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: "answer-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
