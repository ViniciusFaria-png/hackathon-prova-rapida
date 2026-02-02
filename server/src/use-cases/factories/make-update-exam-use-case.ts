import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { UpdateExamUseCase } from "../update-exam";

export function makeUpdateExamUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new UpdateExamUseCase(examRepository);
  return useCase;
}
