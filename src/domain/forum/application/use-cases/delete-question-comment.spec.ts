import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository.js";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment.js";
import { makeQuestionComment } from "test/factories/make-question-comment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error.js";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("Should be able to delete a question comment", async () => {
    const newQuestionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete another user question comment", async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityId("author-01"),
    });

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      authorId: "author-02",
      questionCommentId: newQuestionComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
  });
});
