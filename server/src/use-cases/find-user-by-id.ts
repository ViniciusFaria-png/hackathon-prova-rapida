
import { User } from "../entities/user-entity";
import { IUserRepository } from "../repositories/user-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindUserByIdUseCaseRequest {
  userId: string | number;
}

interface FindUserByIdUseCaseResponse {
  user: User;
}

export class FindUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
  }: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}

