
import { UserRepository } from "../../repositories/pg/user-repository";
import { DeleteUserUseCase } from "../delete-user";

export function makeDeleteUserUseCase() {
  const userRepository = new UserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);

  return deleteUserUseCase;
}
