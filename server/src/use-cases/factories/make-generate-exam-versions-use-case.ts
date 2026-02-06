import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { GenerateExamVersionsUseCase } from "../generate-exam-versions";

export function makeGenerateExamVersionsUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new GenerateExamVersionsUseCase(examRepository);
  return useCase;
}
