import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class GetExamStatsUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string) {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new ResourceNotFoundError();
    }

    const stats = await this.examRepository.getExamStats(examId);
    return stats;
  }
}
