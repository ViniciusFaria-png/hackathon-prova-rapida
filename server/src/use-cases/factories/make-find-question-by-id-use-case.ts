import { PGQuestionRepository } from "../../repositories/pg/question-repository";
import { FindQuestionByIdUseCase } from "../find-question-by-id";

export function makeFindQuestionByIdUseCase() {
  const questionRepository = new PGQuestionRepository();
  const useCase = new FindQuestionByIdUseCase(questionRepository);
  return useCase;
}
