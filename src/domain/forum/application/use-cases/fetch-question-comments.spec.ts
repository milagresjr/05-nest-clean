import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository.js";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comment.js";
import { makeQuestionComment } from "test/factories/make-question-comment.js";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Comments", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("Should be able to fetch question comments", async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("question-01"),
      }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("question-01"),
      }),
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId("question-01"),
      }),
    );

    const result = await sut.execute({
      questionId: "question-01",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionsComment).toHaveLength(3);
  });

  it("Should be able to fetch paginated question comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId("question-01"),
        }),
      );
    }
    const result = await sut.execute({
      questionId: "question-01",
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionsComment).toHaveLength(2);
  });
});
