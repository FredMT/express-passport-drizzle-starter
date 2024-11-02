export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  credential: string;
  password: string;
}

export interface ResetPasswordDTO {
  password: string;
}

export interface TokenPayload {
  userId: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
