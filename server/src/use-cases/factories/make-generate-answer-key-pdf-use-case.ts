import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { GenerateAnswerKeyPdfUseCase } from "../generate-answer-key-pdf";

export function makeGenerateAnswerKeyPdfUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new GenerateAnswerKeyPdfUseCase(examRepository);
  return useCase;
}
