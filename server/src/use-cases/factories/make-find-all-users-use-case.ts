
import { UserRepository } from "../../repositories/pg/user-repository";
import { FindAllUsersUseCase } from "../find-all-users";

export function makeFindAllUsersUseCase() {
  const userRepository = new UserRepository();
  const findAllUsersUseCase = new FindAllUsersUseCase(userRepository);

  return findAllUsersUseCase;
}
