export interface FriendInterface {
  userId: string;
  username: string;
  friendId: string;
  friendUsername: string;
  status: string;
  direction: 'incoming' | 'outgoing' | 'accepted';
  createdAt: string;
}