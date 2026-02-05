import { hash } from "bcryptjs";
import { User } from "../entities/user-entity";
import { IUserRepository } from "../repositories/user-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateUserUseCaseRequest {
  userId: string | number;
  name?: string;
  email?: string;
  password?: string;
}

interface UpdateUserUseCaseResponse {
  user: User;
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
    ...data
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    if (data.password) {
      data.password = await hash(data.password, 8);
    }

    const user = await this.userRepository.update(userId, data);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}

