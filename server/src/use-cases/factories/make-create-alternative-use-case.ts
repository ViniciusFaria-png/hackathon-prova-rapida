import { PGAlternativeRepository } from "../../repositories/pg/alternative-repository";
import { CreateAlternativeUseCase } from "../create-alternative";

export function makeCreateAlternativeUseCase() {
  const alternativeRepository = new PGAlternativeRepository();
  const useCase = new CreateAlternativeUseCase(alternativeRepository);
  return useCase;
}
