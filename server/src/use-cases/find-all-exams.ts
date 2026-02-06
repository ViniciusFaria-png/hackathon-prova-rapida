import { FindExamsFilters, IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class FindAllExamsUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(userId: string, filters?: Omit<FindExamsFilters, 'userId'>) {
    const exams = await this.examRepository.findAllByUserId(userId, { ...filters, userId });
    return exams;
  }
}
