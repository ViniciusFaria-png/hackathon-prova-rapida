import { IQuestionRepository, UpdateQuestionDTO } from "../repositories/question-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class UpdateQuestionUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async handler(id: string, data: UpdateQuestionDTO) {
    const question = await this.questionRepository.findById(id);
    
    if (!question) {
      throw new ResourceNotFoundError();
    }

    await this.questionRepository.update(id, data);
  }
}
