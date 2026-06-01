
export interface IGame {
  id: string,
  title: string,
  description: string,
  price: number,
  realeseDate: string,
  owerId: string,
  oweruUsername: string,
  geners: string[],
}

export interface IResponseGames {
  game: IGame[];
}
