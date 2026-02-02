import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { ReorderExamQuestionsUseCase } from "../reorder-exam-questions";

export function makeReorderExamQuestionsUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new ReorderExamQuestionsUseCase(examRepository);
  return useCase;
}
