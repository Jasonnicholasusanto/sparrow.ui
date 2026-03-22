export interface QuoteResult {
  symbol: string;
  score?: number;
  shortname?: string;
  longname?: string;
  index?: string;
  exchange?: string;
  exchDisp?: string;
  quoteType?: string;
  typeDisp?: string;
  sector?: string;
  sectorDisp?: string;
  industry?: string;
  industryDisp?: string;
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
