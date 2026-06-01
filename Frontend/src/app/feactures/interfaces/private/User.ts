export interface IUser {
  id: string;
  email: string;
  username: string;
  country?: string;
  roles: string[];
  createdAt?: string;
  lastLogin?: string;
}
