import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { PGQuestionRepository } from "../../repositories/pg/question-repository";
import { UpdateQuestionUseCase } from "../update-question";

export function makeUpdateQuestionUseCase() {
  const questionRepository = new PGQuestionRepository();
  const examRepository = new PGExamRepository();
  const useCase = new UpdateQuestionUseCase(questionRepository, examRepository);
  return useCase;
}
