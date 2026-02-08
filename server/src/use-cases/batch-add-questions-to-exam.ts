import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export interface BatchAddQuestionsDTO {
  examId: string;
  questions: Array<{ questionId: string; position: number }>;
}

export class BatchAddQuestionsToExamUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(data: BatchAddQuestionsDTO): Promise<void> {
    for (const { questionId, position } of data.questions) {
      await this.examRepository.addQuestion({
        examId: data.examId,
        questionId,
        position,
      });
    }
  }
}
