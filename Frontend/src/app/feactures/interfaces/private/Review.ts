export interface IReview {
  id: string;
  gameId: string;
  userId?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface ICreateReview {
  gameId: string;
  rating: number;
  comment?: string;
}

export interface IUpdateReview {
  rating: number;
  comment?: string;
}
