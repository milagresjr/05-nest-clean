import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository.js";
import { FakerHasher } from "test/cryptography/fake-hasher.js";
import { RegisterStudentUseCase } from "./register-student.js";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error.js";

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakerHasher: FakerHasher;
let sut: RegisterStudentUseCase;

describe("Register Student", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakerHasher = new FakerHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakerHasher);
  });

  it("Should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentRepository.items).toHaveLength(1);
    expect(inMemoryStudentRepository.items[0]).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      password: "123456-hashed",
    });

    if (result.isRight()) {
      expect(result.value.student.password).toBe("123456-hashed");
    }
  });

  it("Should not be able to register a student with same email twice", async () => {
    await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    const result = await sut.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
    expect(inMemoryStudentRepository.items).toHaveLength(1);
  });
});
