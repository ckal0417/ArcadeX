export interface IAchievement {
  id: string;
  gameId: string;
  title: string;
  description?: string;
  unlockedAt?: string;
}

export interface ICreateAchievement {
  gameId: string;
  title: string;
  description?: string;
}
