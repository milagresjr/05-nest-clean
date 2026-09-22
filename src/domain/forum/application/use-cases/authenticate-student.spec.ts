import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository.js";
import { FakerHasher } from "test/cryptography/fake-hasher.js";
import { FakeEncrypter } from "test/cryptography/fake-encrypter.js";
import { makeStudent } from "test/factories/make-student.js";
import { AuthenticateStudentUseCase } from "./authenticate-student.js";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.js";

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakerHasher: FakerHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(async () => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakerHasher = new FakerHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakerHasher,
      fakeEncrypter,
    );

    const student = makeStudent({
      name: "John Doe",
      email: "john@example.com",
      password: await fakerHasher.hash("123456"),
    });

    await inMemoryStudentRepository.create(student);
  });

  it("Should be able to authenticate a student", async () => {
    const result = await sut.execute({
      email: "john@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.accessToken).toEqual(
        JSON.stringify({
          id: inMemoryStudentRepository.items[0]?.id.toString(),
        }),
      );
    }
  });

  it("Should not be able to authenticate with wrong password", async () => {
    const result = await sut.execute({
      email: "john@example.com",
      password: "wrong-password",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("Should not be able to authenticate with non existing student", async () => {
    const result = await sut.execute({
      email: "non-existing@example.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
