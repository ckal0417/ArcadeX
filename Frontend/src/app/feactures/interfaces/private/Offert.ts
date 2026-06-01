export interface IOffert {
  id: string;
  gameId: string;
  discountPct: number;
  startDate: string;
  endDate: string;
  status?: string;
}

export type IResponseOfferts = IOffert[];
