import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class AddQuestionToExamUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(examId: string, questionId: string, position: number) {
    await this.examRepository.addQuestion({ examId, questionId, position });
  }
}
