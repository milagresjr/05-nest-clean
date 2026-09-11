import { Entity } from "@/core/entities/entity.js";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityId) {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}
