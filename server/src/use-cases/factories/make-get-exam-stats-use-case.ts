import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { GetExamStatsUseCase } from "../get-exam-stats";

export function makeGetExamStatsUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new GetExamStatsUseCase(examRepository);
  return useCase;
}
