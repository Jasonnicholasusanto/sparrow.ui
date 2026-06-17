import { ArrowDownRight, ArrowUpRight, Briefcase, Flame } from "lucide-react";

import type {
  AiInsight,
  DashboardStat,
  MarketPulse,
  NewsItem,
  WatchlistSummary,
} from "@/schemas/dashboardTypes";

export const userName = "Jason";

export const heroStats: DashboardStat[] = [
  {
    id: "best-stock",
    label: "Best performing stock",
    title: "NVDA",
    description: "NVIDIA is leading your tracked universe today.",
    value: "+3.82%",
    change: 3.82,
    icon: ArrowUpRight,
  },
  {
    id: "worst-stock",
    label: "Worst performing stock",
    title: "TSLA",
    description: "Tesla is the weakest mover across your watchlists.",
    value: "-1.64%",
    change: -1.64,
    icon: ArrowDownRight,
  },
  {
    id: "best-watchlist",
    label: "Best performing watchlist",
    title: "AI & Chips",
    description: "Semiconductor exposure is driving outperformance.",
    value: "+4.91%",
    change: 4.91,
    icon: Flame,
  },
  {
    id: "worst-watchlist",
    label: "Worst performing watchlist",
    title: "Dividend Picks",
    description: "Defensive names are slightly lagging growth today.",
    value: "-0.82%",
    change: -0.82,
    icon: Briefcase,
  },
];

export const watchlists: WatchlistSummary[] = [
  {
    id: "1",
    name: "Tech Giants",
    description: "Large-cap tech leaders with strong momentum.",
    visibility: "Private",
    stocksCount: 7,
    dailyChange: 2.34,
    monthlyChange: 8.42,
    topTicker: "NVDA",
    topTickerChange: 3.82,
  },
  {
    id: "2",
    name: "Dividend Picks",
    description: "Stable names focused on yield and defensiveness.",
    visibility: "Private",
    stocksCount: 6,
    dailyChange: -0.82,
    monthlyChange: 1.24,
    topTicker: "KO",
    topTickerChange: 0.44,
  },
  {
    id: "3",
    name: "AI & Chips",
    description: "Semiconductors and AI infrastructure exposure.",
    visibility: "Public",
    stocksCount: 9,
    dailyChange: 4.91,
    monthlyChange: 13.76,
    topTicker: "AVGO",
    topTickerChange: 4.21,
    forks: 18,
    bookmarks: 46,
  },
];

export const discoverWatchlists: WatchlistSummary[] = [
  {
    id: "discover-1",
    name: "AI Winners 2026",
    description: "A public basket of AI infrastructure and software names.",
    visibility: "Public",
    stocksCount: 15,
    dailyChange: 3.18,
    monthlyChange: 11.42,
    topTicker: "NVDA",
    topTickerChange: 3.82,
    forks: 124,
    bookmarks: 312,
  },
  {
    id: "discover-2",
    name: "ASX Dividend Machines",
    description: "Income-focused Australian large-cap dividend names.",
    visibility: "Public",
    stocksCount: 18,
    dailyChange: 0.62,
    monthlyChange: 2.14,
    topTicker: "CBA",
    topTickerChange: 0.91,
    forks: 42,
    bookmarks: 98,
  },
  {
    id: "discover-3",
    name: "Cybersecurity Compounders",
    description: "Cybersecurity stocks with strong long-term growth themes.",
    visibility: "Public",
    stocksCount: 11,
    dailyChange: 1.74,
    monthlyChange: 6.83,
    topTicker: "CRWD",
    topTickerChange: 2.13,
    forks: 67,
    bookmarks: 141,
  },
];

export const marketPulse: MarketPulse = {
  indices: [
    { symbol: "SPX", name: "S&P 500", price: "5,214.56", change: 0.74 },
    { symbol: "NDX", name: "Nasdaq 100", price: "18,205.42", change: 1.21 },
    { symbol: "DJI", name: "Dow Jones", price: "39,442.18", change: -0.18 },
    { symbol: "ASX200", name: "ASX 200", price: "7,812.30", change: 0.26 },
  ],
  highestVolume: [
    {
      symbol: "TSLA",
      name: "Tesla",
      price: "$188.44",
      change: -1.64,
      volume: "118.2M",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA",
      price: "$943.20",
      change: 3.82,
      volume: "91.7M",
    },
    {
      symbol: "AAPL",
      name: "Apple",
      price: "$213.21",
      change: 1.18,
      volume: "74.5M",
    },
  ],
  mostVolatile: [
    {
      symbol: "PLTR",
      name: "Palantir",
      price: "$31.87",
      change: 4.29,
      volume: "63.1M",
    },
    {
      symbol: "COIN",
      name: "Coinbase",
      price: "$244.82",
      change: -3.46,
      volume: "28.4M",
    },
    {
      symbol: "SMCI",
      name: "Super Micro Computer",
      price: "$807.64",
      change: 5.12,
      volume: "16.9M",
    },
  ],
  gainers: [
    {
      symbol: "SMCI",
      name: "Super Micro Computer",
      price: "$807.64",
      change: 5.12,
    },
    { symbol: "PLTR", name: "Palantir", price: "$31.87", change: 4.29 },
    { symbol: "NVDA", name: "NVIDIA", price: "$943.20", change: 3.82 },
  ],
  losers: [
    { symbol: "COIN", name: "Coinbase", price: "$244.82", change: -3.46 },
    { symbol: "TSLA", name: "Tesla", price: "$188.44", change: -1.64 },
    { symbol: "BABA", name: "Alibaba", price: "$78.21", change: -1.22 },
  ],
  sectorPerformance: [
    { name: "Technology", change: 1.42 },
    { name: "Healthcare", change: 0.31 },
    { name: "Energy", change: -1.12 },
    { name: "Financials", change: 0.84 },
    { name: "Consumer Defensive", change: -0.24 },
  ],
  industryPerformance: [
    { name: "Semiconductors", change: 2.48 },
    { name: "Cybersecurity", change: 1.53 },
    { name: "Regional Banks", change: 0.92 },
    { name: "Solar", change: -1.84 },
    { name: "Airlines", change: -0.63 },
  ],
};

export const newsItems: NewsItem[] = [
  {
    id: "1",
    category: "Earnings",
    title: "NVIDIA extends gains as AI demand narrative strengthens",
    summary:
      "Investors continue pricing in strong data-centre demand, with sentiment remaining constructive across semiconductor names.",
    sentiment: "Bullish",
    impact: "High",
    relatedTickers: ["NVDA", "AMD", "AVGO"],
    relatedWatchlists: ["AI & Chips", "Tech Giants"],
    time: "2h ago",
  },
  {
    id: "2",
    category: "Macro",
    title: "Markets reassess rate path after fresh inflation commentary",
    summary:
      "Growth and tech names remain sensitive as traders weigh how long higher rates could persist into the next quarter.",
    sentiment: "Neutral",
    impact: "Medium",
    relatedTickers: ["QQQ", "SPY", "TSLA"],
    relatedWatchlists: ["Tech Giants"],
    time: "4h ago",
  },
  {
    id: "3",
    category: "Risk",
    title: "Tesla volatility picks up as delivery expectations shift",
    summary:
      "Short-term price action has become more reactive, increasing headline risk for momentum-focused watchlists.",
    sentiment: "Bearish",
    impact: "Medium",
    relatedTickers: ["TSLA"],
    relatedWatchlists: ["Tech Giants"],
    time: "5h ago",
  },
];

export const aiInsights: AiInsight[] = [
  {
    id: "1",
    title: "Portfolio concentration risk",
    description:
      "Your watchlists are currently tilted heavily toward technology and AI, which could amplify downside during risk-off sessions.",
    tone: "negative",
  },
  {
    id: "2",
    title: "Momentum remains favourable",
    description:
      "Semiconductor exposure is still leading your current watchlist performance, with multiple names showing continued strength.",
    tone: "positive",
  },
  {
    id: "3",
    title: "Key event to watch",
    description:
      "Upcoming macro commentary and earnings releases may drive the next leg of movement across your highest-conviction names.",
    tone: "neutral",
  },
];
