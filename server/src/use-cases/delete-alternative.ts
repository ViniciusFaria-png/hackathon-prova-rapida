import { IAlternativeRepository } from "../repositories/alternative-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class DeleteAlternativeUseCase {
  constructor(private alternativeRepository: IAlternativeRepository) {}

  async handler(id: string) {
    const alternative = await this.alternativeRepository.findById(id);
    
    if (!alternative) {
      throw new ResourceNotFoundError();
    }

    await this.alternativeRepository.delete(id);
  }
}
