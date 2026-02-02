import { User } from "../entities/user-entity";
import { IUserRepository } from "../repositories/user-repository.interface";

export class SigninUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async handler(email: string): Promise<User | null> {
    return this.userRepository.signin(email);
  }
}
