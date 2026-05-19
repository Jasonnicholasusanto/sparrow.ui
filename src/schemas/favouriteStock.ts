export interface FavouriteStockResponse {
  id: number;
  symbol: string;
  exchange: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  tickerDetails: {
    lastPrice: number | null;
    currency: string | null;
    volume: number | null;
    previousClose: number | null;
    regularMarketChange: number | null;
    regularMarketChangePercent: number | null;
  };
}

export interface FavouriteStockRequest {
  symbol: string;
  exchange: string;
  note?: string | null;
}
