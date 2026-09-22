import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachment-repository";
import { PrismaAnswersCommentRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachment-repository";
import { PrismaQuestionsCommentRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaNotificationRepository } from "./prisma/repositories/prisma-notification-repository";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { StudentRepository } from "@/domain/forum/application/repositories/student-repository";
import { PrismaStudentRepository } from "./prisma/repositories/prisma-student-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersCommentRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    PrismaQuestionsRepository,
    PrismaNotificationRepository,
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersCommentRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    PrismaQuestionsRepository,
    PrismaNotificationRepository,
  ],
})
export class DatabaseModule {}
