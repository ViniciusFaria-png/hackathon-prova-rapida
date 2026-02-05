import { IQuestionRepository } from "../repositories/question-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DeleteQuestionUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async handler(id: string) {
    const question = await this.questionRepository.findById(id);
    
    if (!question) {
      throw new ResourceNotFoundError();
    }

    await this.questionRepository.delete(id);
  }
}
