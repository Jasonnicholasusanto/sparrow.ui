export interface FavouriteStockResponse {
  id: number;
  symbol: string;
  exchange: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  tickerDetails: {
    last_price: number | null;
    currency: string | null;
    volume: number | null;
    previous_close: number | null;
    regular_market_change: number | null;
    regular_market_change_percent: number | null;
  };
}

export interface FavouriteStockRequest {
  symbol: string;
  exchange: string;
  note?: string | null;
}
