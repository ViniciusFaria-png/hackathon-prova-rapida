import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { IQuestionRepository, UpdateQuestionDTO } from "../repositories/question-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export interface UpdateQuestionResult {
  id: string;
  copied: boolean;
}

export class UpdateQuestionUseCase {
  constructor(
    private readonly questionRepository: IQuestionRepository,
    private readonly examRepository: IExamRepository,
  ) {}

  async handler(id: string, data: UpdateQuestionDTO, userId: string): Promise<UpdateQuestionResult> {
    const question = await this.questionRepository.findById(id);

    if (!question) {
      throw new ResourceNotFoundError();
    }

    const isPublicFromOtherAuthor =
      question.is_public && question.user_id !== null && question.user_id !== userId;

    const usages = await this.examRepository.getQuestionExamUsage(id);
    const isInFinalizedExam = usages.some((u) => u.status === "finalized");

    if (isInFinalizedExam || isPublicFromOtherAuthor) {
      const newQuestion = await this.questionRepository.create({
        statement: data.statement ?? question.statement,
        subject: data.subject ?? question.subject,
        difficulty: data.difficulty ?? question.difficulty,
        userId,
        isPublic: data.isPublic ?? question.is_public,
        alternatives: question.alternatives.map((a) => ({
          text: a.text,
          isCorrect: a.is_correct,
        })),
      });

      return { id: newQuestion.id, copied: true };
    }

    await this.questionRepository.update(id, data);
    return { id, copied: false };
  }
}
