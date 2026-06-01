export interface IOffert {
  offerId: number;
  gameId: string;
  gameTitle: string;
  originalPrice: number;
  discountPct: number;
  finalPrice: number;
  startDate: string;
  endDate: string;
}

export type IResponseOfferts = IOffert[];
