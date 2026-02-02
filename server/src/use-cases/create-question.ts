import { CreateQuestionDTO, IQuestionRepository } from "../repositories/question-repository.interface";

export class CreateQuestionUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async handler(data: CreateQuestionDTO) {
    const question = await this.questionRepository.create(data);
    return question;
  }
}
