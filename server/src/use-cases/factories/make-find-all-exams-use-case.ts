import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { FindAllExamsUseCase } from "../find-all-exams";

export function makeFindAllExamsUseCase() {
  const examRepository = new PGExamRepository();
  const useCase = new FindAllExamsUseCase(examRepository);
  return useCase;
}
