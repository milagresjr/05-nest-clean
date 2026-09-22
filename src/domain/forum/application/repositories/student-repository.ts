import { Student } from "../../enterprise/entities/student.js";

export abstract class StudentRepository {
  abstract findByEmail(email: string): Promise<Student | null>;
  abstract create(student: Student): Promise<void>;
}
