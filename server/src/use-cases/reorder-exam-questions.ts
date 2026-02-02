import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class ReorderExamQuestionsUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(examId: string, questionOrders: Array<{ questionId: string; position: number }>) {
    await this.examRepository.reorderQuestions(examId, questionOrders);
  }
}
