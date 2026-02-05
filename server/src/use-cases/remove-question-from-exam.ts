import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class RemoveQuestionFromExamUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(examId: string, questionId: string) {
    await this.examRepository.removeQuestion(examId, questionId);
  }
}
