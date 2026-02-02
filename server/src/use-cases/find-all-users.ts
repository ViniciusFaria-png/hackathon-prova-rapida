import { User } from "../entities/user-entity";
import { IUserRepository } from "../repositories/user-repository.interface";


interface FindAllUsersUseCaseResponse {
  users: User[];
}

export class FindAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<FindAllUsersUseCaseResponse> {
    const users = await this.userRepository.findAll();

    return {
      users,
    };
  }
}
