export interface IUser {
  id: string;
  email: string;
  username: string;
  country?: string;
  roles: string[];
  avatarUrl?: string;
  createdAt?: string;
  lastLogin?: string;
}