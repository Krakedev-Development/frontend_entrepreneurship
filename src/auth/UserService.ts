import { User } from "./entities/User"

export class UserService {
  private users: User[] = [
    new User(1, "John Doe", "email@example.com", "1234", new Date()),
  ]
  /**
  async login(email: string, password: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      return null;
    }
    if (!user.checkPassword(password)) {
      return null;
    }
    return user;
  }
   */
  async login() {
    return this.users[0];
  }
}