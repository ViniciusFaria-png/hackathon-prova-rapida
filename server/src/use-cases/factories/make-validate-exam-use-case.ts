import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { ValidateExamUseCase } from "../validate-exam";

export function makeValidateExamUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new ValidateExamUseCase(examRepository);
  return useCase;
}
