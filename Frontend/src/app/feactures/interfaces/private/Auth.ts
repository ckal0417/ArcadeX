export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  roles: string[];
  username: string;
  email: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  username?: string;
  name?: string;
  avatar?: string | null;
  exp?: number;
  iat?: number;
}