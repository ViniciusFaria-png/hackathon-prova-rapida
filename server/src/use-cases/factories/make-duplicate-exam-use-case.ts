import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { DuplicateExamUseCase } from "../duplicate-exam";

export function makeDuplicateExamUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new DuplicateExamUseCase(examRepository);
  return useCase;
}
