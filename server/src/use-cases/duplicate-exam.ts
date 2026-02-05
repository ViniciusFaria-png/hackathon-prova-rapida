import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DuplicateExamUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(examId: string, userId: string, newTitle?: string) {
    const exam = await this.examRepository.findById(examId);
    
    if (!exam) {
      throw new ResourceNotFoundError();
    }

    const result = await this.examRepository.duplicate(examId, userId, newTitle || `${exam.title} (Cópia)`);
    
    return result;
  }
}
