import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { ShuffleExamUseCase } from "../shuffle-exam";

export function makeShuffleExamUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new ShuffleExamUseCase(examRepository);
  return useCase;
}
