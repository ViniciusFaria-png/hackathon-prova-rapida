import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class FinalizeExamVersionUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string) {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new ResourceNotFoundError();
    }

    const shuffleSeed = Math.floor(Math.random() * 10000);

    const questionPositions = exam.questions.map((q, index) => ({
      questionId: q.id,
      position: index + 1,
    }));

    const version = await this.examRepository.createVersion(
      examId,
      `Versão Finalizada`,
      shuffleSeed,
      questionPositions,
      'finalized'
    );

    const createdVersion = await this.examRepository.findVersionById(version.id);

    return {
      versionId: version.id,
      seed: shuffleSeed,
      createdAt: createdVersion?.created_at || new Date(),
    };
  }
}
