export interface QuoteResult {
  symbol: string;
  score?: number;
  shortname?: string;
  longname?: string;
  index?: string;
  exchange?: string;
  exchDisp?: string;
  typeDisp?: string;
  sectorDisp?: string;
  industryDisp?: string;
  currency?: string;
  lastPrice?: number;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  previousClose?: number;
  regularMarketPreviousClose?: number;
  lastVolume?: number;
  yearChange?: number;
  yearHigh?: number;
  yearLow?: number;
  timezone?: string;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
}

export interface SearchQuotesResponse {
  query: string;
  results: QuoteResult[];
}

export interface SearchHistoryEntry {
  id: number;
  query: string;
  type: string;
  searchedAt: string;
}
