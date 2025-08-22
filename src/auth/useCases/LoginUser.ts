import { UserService } from "../UserService"

export class LoginUser {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(email: string, password: string) {
    const user = await this.userService.login(email, password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return user;
  }
}
