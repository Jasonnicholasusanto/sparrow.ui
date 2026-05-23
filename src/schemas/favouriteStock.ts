import { TickerMarketSnapshotResponse } from "./tickerMarketSnapshot";

export interface FavouriteStockResponse {
  id: number;
  symbol: string;
  exchange: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  tickerDetails: TickerMarketSnapshotResponse;
}

export interface FavouriteStockRequest {
  symbol: string;
  exchange: string;
  note?: string | null;
}
