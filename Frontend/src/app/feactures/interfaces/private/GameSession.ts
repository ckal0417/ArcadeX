export interface IGameSession {
  id: string;
  gameId: string;
  startTime: string;
  endTime?: string;
}

export interface IStartGameSession {
  gameId: string;
}
