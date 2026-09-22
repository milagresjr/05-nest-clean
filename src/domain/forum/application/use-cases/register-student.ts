import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { Question } from "../../enterprise/entities/question.js";
import { QuestionRepository } from "../repositories/question-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment.js";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list.js";
import { Injectable } from "@nestjs/common";
import { StudentRepository } from "../repositories/student-repository.js";
import { HasherGenerator } from "../cryptography/hasher-generator.js";
import { Student } from "../../enterprise/entities/student.js";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error.js";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HasherGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentRepository.create(student);

    return right({
      student,
    });
  }
}
