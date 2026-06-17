import type { LucideIcon } from "lucide-react";

export type Sentiment = "Bullish" | "Bearish" | "Neutral";

export type InsightTone = "positive" | "negative" | "neutral";

export type DashboardStat = {
  id: string;
  label: string;
  title: string;
  description: string;
  value: string;
  change: number;
  icon: LucideIcon;
};

export type WatchlistSummary = {
  id: string;
  name: string;
  description: string;
  visibility: "Private" | "Public" | "Shared" | "Forked";
  stocksCount: number;
  dailyChange: number;
  monthlyChange: number;
  topTicker: string;
  topTickerChange: number;
  forks?: number;
  bookmarks?: number;
};

export type MarketItem = {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume?: string;
};

export type PerformanceItem = {
  name: string;
  change: number;
};

export type MarketPulse = {
  indices: MarketItem[];
  highestVolume: MarketItem[];
  mostVolatile: MarketItem[];
  gainers: MarketItem[];
  losers: MarketItem[];
  sectorPerformance: PerformanceItem[];
  industryPerformance: PerformanceItem[];
};

export type NewsItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  sentiment: Sentiment;
  impact: "Low" | "Medium" | "High";
  relatedTickers: string[];
  relatedWatchlists: string[];
  time: string;
};

export type AiInsight = {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
};
