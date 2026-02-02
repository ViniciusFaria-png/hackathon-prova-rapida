
import { IUserRepository } from "../repositories/user-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteUserUseCaseRequest {
  userId: number;
}

type DeleteUserUseCaseResponse = void;

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) {
      throw new ResourceNotFoundError();
    }

    await this.userRepository.delete(userId);
  }
}
