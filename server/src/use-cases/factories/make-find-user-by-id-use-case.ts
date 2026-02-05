
import { UserRepository } from "../../repositories/pg/user-repository";
import { FindUserByIdUseCase } from "../find-user-by-id";

export function makeFindUserByIdUseCase() {
  const userRepository = new UserRepository();
  const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);

  return findUserByIdUseCase;
}
