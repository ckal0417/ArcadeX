
export interface IGame {
  id: string,
  title: string,
  description: string,
  price: number,
  releaseDate: string,
  ownerId: string,
  ownerUsername: string,
  genres: string[],
}

export type IResponseGames = IGame[];
