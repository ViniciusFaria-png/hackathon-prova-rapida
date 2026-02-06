import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { FinalizeExamVersionUseCase } from "../finalize-exam-version";

export function makeFinalizeExamVersionUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new FinalizeExamVersionUseCase(examRepository);
  return useCase;
}
