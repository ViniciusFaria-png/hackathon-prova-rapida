import { PGQuestionRepository } from "../../repositories/pg/question-repository";
import { FindAllQuestionsUseCase } from "../find-all-questions";

export function makeFindAllQuestionsUseCase() {
  const questionRepository = new PGQuestionRepository();
  const useCase = new FindAllQuestionsUseCase(questionRepository);
  return useCase;
}
