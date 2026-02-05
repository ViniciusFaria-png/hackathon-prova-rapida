import { PGQuestionRepository } from "../../repositories/pg/question-repository";
import { CreateQuestionUseCase } from "../create-question";

export function makeCreateQuestionUseCase() {
  const questionRepository = new PGQuestionRepository();
  const useCase = new CreateQuestionUseCase(questionRepository);
  return useCase;
}
