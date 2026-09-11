import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository.js";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comment.js";
import { makeAnswerComment } from "test/factories/make-answer-comment.js";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("Should be able to fetch answer comments", async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("answer-01"),
      }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("answer-01"),
      }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId("answer-01"),
      }),
    );

    const result = await sut.execute({
      answerId: "answer-01",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answersComment).toHaveLength(3);
  });

  it("Should be able to fetch paginated answer comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("answer-01"),
        }),
      );
    }
    const result = await sut.execute({
      answerId: "answer-01",
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answersComment).toHaveLength(2);
  });
});
