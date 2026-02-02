import { IExamRepository, UpdateExamDTO } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class UpdateExamUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(id: string, data: UpdateExamDTO) {
    const exam = await this.examRepository.findById(id);
    
    if (!exam) {
      throw new ResourceNotFoundError();
    }

    await this.examRepository.update(id, data);
  }
}
