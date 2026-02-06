import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class GenerateExamVersionsUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string, count: number) {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new ResourceNotFoundError();
    }

    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const versions: Array<{ versionId: string; seed: number; label: string }> = [];

    for (let i = 0; i < count && i < 26; i++) {
      const seed = Math.floor(Math.random() * 10000);
      const label = `Versão ${labels[i]}`;

      const questions = [...exam.questions];
      const shuffled = this.shuffleArray(questions, seed);

      const questionPositions = shuffled.map((q, index) => ({
        questionId: q.id,
        position: index + 1,
      }));

      const version = await this.examRepository.createVersion(
        examId,
        label,
        seed,
        questionPositions,
        'finalized'
      );

      versions.push({
        versionId: version.id,
        seed,
        label,
      });
    }

    return versions;
  }

  private shuffleArray<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;

    const seededRandom = (s: number) => {
      const x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(seededRandom(seed++) * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }

    return shuffled;
  }
}
