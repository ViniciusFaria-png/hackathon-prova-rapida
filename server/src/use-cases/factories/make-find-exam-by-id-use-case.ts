import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { FindExamByIdUseCase } from "../find-exam-by-id";

export function makeFindExamByIdUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new FindExamByIdUseCase(examRepository);
  return useCase;
}
