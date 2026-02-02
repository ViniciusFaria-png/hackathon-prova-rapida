import { PGQuestionRepository } from "../../repositories/pg/question-repository";
import { UpdateQuestionUseCase } from "../update-question";

export function makeUpdateQuestionUseCase() {
  const questionRepository = new PGQuestionRepository();
  const useCase = new UpdateQuestionUseCase(questionRepository);
  return useCase;
}
