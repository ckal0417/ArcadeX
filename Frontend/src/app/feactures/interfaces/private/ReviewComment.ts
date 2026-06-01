export interface IReviewComment {
  id: number;
  reviewId: string;
  userId?: string;
  comment: string;
  createdAt?: string;
}

export interface ICreateReviewComment {
  reviewId: string;
  comment: string;
}

export interface IUpdateReviewComment {
  comment: string;
}
