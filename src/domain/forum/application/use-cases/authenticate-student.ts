import { left, right, type Either } from "@/core/either.js";
import { Injectable } from "@nestjs/common";
import { StudentRepository } from "../repositories/student-repository.js";
import { HasherComparer } from "../cryptography/hash-comparer.js";
import { Encrypter } from "../cryptography/encrypter.js";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.js";

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashComparer: HasherComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      id: student.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
