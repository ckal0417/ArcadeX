export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  roles: string[];
}

export interface JwtPayload {
    sub: number;
    email: string;
    iat: number;
    exp?: number;
}
