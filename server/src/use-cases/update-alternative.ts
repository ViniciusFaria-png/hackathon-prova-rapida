import { IAlternativeRepository, UpdateAlternativeDTO } from "../repositories/alternative-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class UpdateAlternativeUseCase {
  constructor(private alternativeRepository: IAlternativeRepository) {}

  async handler(id: string, data: UpdateAlternativeDTO) {
    const alternative = await this.alternativeRepository.findById(id);
    
    if (!alternative) {
      throw new ResourceNotFoundError();
    }

    await this.alternativeRepository.update(id, data);
  }
}
