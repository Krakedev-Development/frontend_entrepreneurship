export interface UserDTO {
  id: number;
  full_name: string;
  email: string;
  created_at: Date | null;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: UserDTO;
  token?: string;
}
