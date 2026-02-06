import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class ValidateExamUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string) {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new ResourceNotFoundError();
    }

    const errors: string[] = [];

    if (exam.questions.length === 0) {
      errors.push("A prova não possui questões.");
    }

    const seenIds = new Set<string>();
    for (const question of exam.questions) {
      if (seenIds.has(question.id)) {
        errors.push(`Questão duplicada encontrada: "${question.statement.substring(0, 50)}..."`);
      }
      seenIds.add(question.id);

      if (!question.alternatives || question.alternatives.length === 0) {
        errors.push(`Questão "${question.statement.substring(0, 50)}..." não possui alternativas.`);
        continue;
      }

      if (question.alternatives.length < 2) {
        errors.push(`Questão "${question.statement.substring(0, 50)}..." precisa ter pelo menos 2 alternativas.`);
      }

      const hasCorrect = question.alternatives.some(a => a.is_correct);
      if (!hasCorrect) {
        errors.push(`Questão "${question.statement.substring(0, 50)}..." não possui alternativa correta.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
