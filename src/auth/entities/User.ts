export class User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  created_at: Date | null;

  constructor(
    id: number,
    full_name: string,
    email: string,
    password: string,
    created_at: Date | null
  ) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
  }

  checkPassword(password: string): boolean {
    return this.password === password;
  }
}
