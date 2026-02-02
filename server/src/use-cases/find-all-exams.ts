import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class FindAllExamsUseCase {
  constructor(private examRepository: IExamRepository) {}

  async handler(userId: string) {
    const exams = await this.examRepository.findAllByUserId(userId);
    return exams;
  }
}
