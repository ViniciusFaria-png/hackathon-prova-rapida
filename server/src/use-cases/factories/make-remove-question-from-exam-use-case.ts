import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { RemoveQuestionFromExamUseCase } from "../remove-question-from-exam";

export function makeRemoveQuestionFromExamUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new RemoveQuestionFromExamUseCase(examRepository);
  return useCase;
}
