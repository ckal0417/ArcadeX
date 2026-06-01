export interface IFriend {
  id: string;
  username: string;
  email: string;
  country?: string;
  status: 'pending' | 'accepted';
}
