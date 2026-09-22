import type { StudentRepository } from "@/domain/forum/application/repositories/student-repository.js";
import type { Student } from "@/domain/forum/enterprise/entities/student.js";

export class InMemoryStudentRepository implements StudentRepository {
  public items: Student[] = [];

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email);

    if (!student) {
      return null;
    }

    return student;
  }

  async create(student: Student) {
    this.items.push(student);
  }
}
