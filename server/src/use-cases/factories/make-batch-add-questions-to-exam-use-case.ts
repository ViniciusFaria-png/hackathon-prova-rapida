import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { BatchAddQuestionsToExamUseCase } from "../batch-add-questions-to-exam";

export function makeBatchAddQuestionsToExamUseCase() {
  const examRepository = new PGExamRepository();
  return new BatchAddQuestionsToExamUseCase(examRepository);
}
