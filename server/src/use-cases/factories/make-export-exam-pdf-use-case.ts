import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { ExportExamPdfUseCase } from "../export-exam-pdf";

export function makeExportExamPdfUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new ExportExamPdfUseCase(examRepository);
  return useCase;
}
