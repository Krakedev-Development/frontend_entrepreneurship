import { UserService } from "../UserService"

export class LoginUser {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute() {
    const user = await this.userService.login();
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return user;
  }
}
