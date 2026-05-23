export interface TickerMarketSnapshotResponse {
  tickerName: string | null;
  lastPrice: number | null;
  currency: string | null;
  volume: number | null;
  previousClose: number | null;
  regularMarketChange: number | null;
  regularMarketChangePercent: number | null;
}
