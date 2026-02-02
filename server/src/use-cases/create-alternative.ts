import { CreateAlternativeDTO, IAlternativeRepository } from "../repositories/alternative-repository.interface";

export class CreateAlternativeUseCase {
  constructor(private alternativeRepository: IAlternativeRepository) {}

  async handler(data: CreateAlternativeDTO) {
    const alternative = await this.alternativeRepository.create(data);
    return alternative;
  }
}
