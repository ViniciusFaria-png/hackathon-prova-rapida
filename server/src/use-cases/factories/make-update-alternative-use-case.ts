import { PGAlternativeRepository } from "../../repositories/pg/alternative-repository";
import { UpdateAlternativeUseCase } from "../update-alternative";

export function makeUpdateAlternativeUseCase() {
  const alternativeRepository = new PGAlternativeRepository();
  const useCase = new UpdateAlternativeUseCase(alternativeRepository);
  return useCase;
}
