import { IUser } from "./models/user-interface";

export class User implements IUser {
  id?: number;
  name: string;
  email: string;
  password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
