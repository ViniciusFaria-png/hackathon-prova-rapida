import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { AddQuestionToExamUseCase } from "../add-question-to-exam";

export function makeAddQuestionToExamUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new AddQuestionToExamUseCase(examRepository);
  return useCase;
}
