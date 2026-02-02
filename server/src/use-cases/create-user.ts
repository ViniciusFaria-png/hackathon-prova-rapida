import { hash } from "bcryptjs";
import { User } from "../entities/user-entity";
import { IUserRepository } from "../repositories/user-repository.interface";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async handler(user: User): Promise<User> {
    const { email, password, name } = user;
    const hashedPassword = await hash(password, 8);

    const newUser = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return newUser;
  }

  
}
