import { User } from "../entities/user-entity";


export interface IUserRepository {
  create(user: User): Promise<User>;
  signin(email: string): Promise<User | null>;
  findById(id: string | number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string | number, data: Partial<Omit<User, "id">>): Promise<User | null>;
  delete(id: string | number): Promise<void>;
}
