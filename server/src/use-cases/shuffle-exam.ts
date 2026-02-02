import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class ShuffleExamUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(examId: string, versionName: string) {
    const exam = await this.examRepository.findById(examId);
    
    if (!exam) {
      throw new ResourceNotFoundError();
    }

    // Gerar seed aleatório
    const shuffleSeed = Math.floor(Math.random() * 10000);

    // Embaralhar questões
    const questions = [...exam.questions];
    const shuffledQuestions = this.shuffleArray(questions, shuffleSeed);

    // Criar nova ordenação
    const questionPositions = shuffledQuestions.map((q, index) => ({
      questionId: q.id,
      position: index + 1
    }));

    const version = await this.examRepository.createVersion(
      examId,
      versionName,
      shuffleSeed,
      questionPositions
    );

    return version;
  }

  private shuffleArray<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomIndex;

    // Seeded random usando seed fornecido
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    while (currentIndex !== 0) {
      randomIndex = Math.floor(seededRandom(seed++) * currentIndex);
      currentIndex--;

      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex]
      ];
    }

    return shuffled;
  }
}
