export interface NewsArticle {
  id: string;
  provider: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  symbols: string[];
  publishedAt: string;
  sentimentLabel: string;
  sentimentScore: number;
}

export interface StockNewsResponse {
  symbol: string;
  results: NewsArticle[];
}
