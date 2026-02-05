import { FindQuestionsFilters, IQuestionRepository } from "../repositories/question-repository.interface";

export class FindAllQuestionsUseCase {
  constructor(private questionRepository: IQuestionRepository) {}

  async handler(filters: FindQuestionsFilters) {
    const questions = await this.questionRepository.findAll(filters);
    return questions;
  }
}
