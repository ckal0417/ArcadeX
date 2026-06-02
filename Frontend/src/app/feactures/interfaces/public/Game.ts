
export interface IGame {
  id: string,
  title: string,
  description: string,
  price: number,
  releaseDate: string,
  ownerId: string,
  ownerUsername: string,
  genres: string[],
  coverImageUrl: string,
}

export interface ICreateGame {
  title: string;
  description?: string;
  price: number;
  releaseDate: string;
  genres: string[];
  coverImageUrl?: string;
}

export type IResponseGames = IGame[];
