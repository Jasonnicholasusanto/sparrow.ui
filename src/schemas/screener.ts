export interface ScreenerTickerInfo {
  // Identity
  symbol: string;
  displayName?: string | null;
  longName?: string | null;
  region?: string | null;

  // Pricing
  regularMarketPrice?: number | null;
  currency?: string | null;
  regularMarketPreviousClose?: number | null;
  regularMarketOpen?: number | null;
  regularMarketChange?: number | null;
  regularMarketDayHigh?: number | null;
  regularMarketDayLow?: number | null;
  regularMarketDayRange?: string | null;

  // 52-week stats
  fiftyTwoWeekRange?: string | null;
  fiftyTwoWeekChangePercent?: number | null;
  fiftyTwoWeekHigh?: number | null;
  fiftyTwoWeekLow?: number | null;

  // Volume
  regularMarketVolume?: number | null;
  averageDailyVolume3Month?: number | null;

  // Valuation
  epsTrailingTwelveMonths?: number | null;
  trailingPE?: number | null;
  marketCap?: number | null;
  averageAnalystRating?: string | null;

  // Order book
  bid?: number | null;
  ask?: number | null;
  bidSize?: number | null;
  askSize?: number | null;

  // Exchange metadata
  exchange?: string | null;
  exchangeTimezoneName?: string | null;
  exchangeTimezoneShortName?: string | null;
  gmtOffSetMilliseconds?: number | null;
  marketState?: string | null;
}

export interface ScreenerCuratedResult {
  asset_type: "equity" | "fund";
  category: string;
  count: number;
  results: ScreenerTickerInfo[];
}
