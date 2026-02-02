import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DeleteExamUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(id: string) {
    const exam = await this.examRepository.findById(id);
    
    if (!exam) {
      throw new ResourceNotFoundError();
    }

    await this.examRepository.delete(id);
  }
}
