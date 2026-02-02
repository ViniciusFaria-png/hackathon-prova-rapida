import { CreateExamDTO, IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class CreateExamUseCase {
    constructor(private examRepository: IExamRepository) {}

    async handler(data: CreateExamDTO) {
        const exam = await this.examRepository.create(data);
        return exam;
    }
}
