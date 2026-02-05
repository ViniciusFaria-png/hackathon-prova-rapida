import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { CreateExamUseCase } from "../create-exam";

export function makeCreateExamUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new CreateExamUseCase(examRepository);
  return useCase;
}
