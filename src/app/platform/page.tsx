"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  Briefcase,
  ChevronRight,
  Globe,
  Newspaper,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BorderGlow from "@/components/border-glow";

type Watchlist = {
  id: string;
  name: string;
  description: string;
  stocksCount: number;
  dailyChange: number;
  topTicker: string;
};

type MarketItem = {
  symbol: string;
  name: string;
  price: string;
  change: number;
};

type NewsItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  relatedTickers: string[];
  time: string;
};

type InsightItem = {
  id: string;
  title: string;
  description: string;
  tone: "positive" | "negative" | "neutral";
};

const userName = "Jason";

const watchlists: Watchlist[] = [
  {
    id: "1",
    name: "Tech Giants",
    description: "Large-cap tech leaders with strong momentum.",
    stocksCount: 7,
    dailyChange: 2.34,
    topTicker: "NVDA",
  },
  {
    id: "2",
    name: "Dividend Picks",
    description: "Stable names focused on yield and defensiveness.",
    stocksCount: 6,
    dailyChange: -0.82,
    topTicker: "KO",
  },
  {
    id: "3",
    name: "AI & Chips",
    description: "Semiconductors and AI infrastructure exposure.",
    stocksCount: 6,
    dailyChange: 4.91,
    topTicker: "AVGO",
  },
];

const keyMovers: MarketItem[] = [
  { symbol: "NVDA", name: "NVIDIA", price: "$943.20", change: 3.82 },
  { symbol: "PLTR", name: "Palantir", price: "$31.87", change: 4.29 },
  { symbol: "TSLA", name: "Tesla", price: "$188.44", change: -1.64 },
  { symbol: "AAPL", name: "Apple", price: "$213.21", change: 1.18 },
];

const majorIndices: MarketItem[] = [
  { symbol: "SPX", name: "S&P 500", price: "5,214.56", change: 0.74 },
  { symbol: "NDX", name: "Nasdaq 100", price: "18,205.42", change: 1.21 },
  { symbol: "DJI", name: "Dow Jones", price: "39,442.18", change: -0.18 },
  { symbol: "ASX200", name: "ASX 200", price: "7,812.30", change: 0.26 },
];

const newsItems: NewsItem[] = [
  {
    id: "1",
    category: "Earnings",
    title: "NVIDIA extends gains as AI demand narrative strengthens",
    summary:
      "Investors continue pricing in strong data-centre demand, with sentiment remaining constructive across semiconductor names.",
    sentiment: "Bullish",
    relatedTickers: ["NVDA", "AMD", "AVGO"],
    time: "2h ago",
  },
  {
    id: "2",
    category: "Macro",
    title: "Markets reassess rate path after fresh inflation commentary",
    summary:
      "Growth and tech names remain sensitive as traders weigh how long higher rates could persist into the next quarter.",
    sentiment: "Neutral",
    relatedTickers: ["QQQ", "SPY", "TSLA"],
    time: "4h ago",
  },
  {
    id: "3",
    category: "Risk",
    title: "Tesla volatility picks up as delivery expectations shift",
    summary:
      "Short-term price action has become more reactive, increasing headline risk for momentum-focused watchlists.",
    sentiment: "Bearish",
    relatedTickers: ["TSLA"],
    time: "5h ago",
  },
];

const aiInsights: InsightItem[] = [
  {
    id: "1",
    title: "Portfolio concentration risk",
    description:
      "Your watchlists are currently tilted heavily toward tech and AI, which could amplify downside during risk-off sessions.",
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

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getSentimentBadgeClass(sentiment: NewsItem["sentiment"]) {
  if (sentiment === "Bullish") {
    return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10";
  }

  if (sentiment === "Bearish") {
    return "bg-rose-500/10 text-rose-600 hover:bg-rose-500/10";
  }

  return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/10";
}

function getInsightToneClass(tone: InsightItem["tone"]) {
  if (tone === "positive") {
    return "border-emerald-500/20 bg-emerald-500/5";
  }

  if (tone === "negative") {
    return "border-rose-500/20 bg-rose-500/5";
  }

  return "border-border bg-muted/30";
}

function ChangePill({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        positive
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-rose-500/10 text-rose-600"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="mt-0.5 rounded-2xl border bg-background p-2 text-muted-foreground">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const greeting = getGreeting();
  const today = format(new Date(), "EEEE, d MMMM yyyy");

  return (
    <div className="space-y-8">
      <section>
        <Card className="overflow-hidden rounded-3xl">
          <CardHeader>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{today}</p>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {greeting}, {userName}
              </h1>
            </div>
          </CardHeader>
          <CardContent>
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#060010"
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={["#c084fc", "#f472b6", "#38bdf8"]}
            >
              <div className="rounded-2xl p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Daily Brief</span>
                </div>

                <p className="text-sm leading-6 text-muted-foreground md:text-base">
                  Your watchlists are showing mixed momentum today, with AI and
                  semiconductor exposure continuing to lead performance. Risk
                  remains concentrated in high-growth tech, while macro
                  commentary and upcoming earnings could drive short-term
                  volatility. The strongest current tailwind is positive
                  sentiment around AI leaders, but names with stretched
                  valuations may react sharply to any negative surprise.
                </p>
              </div>
            </BorderGlow>
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionHeading
          icon={<Briefcase className="h-4 w-4" />}
          title="Your Watchlists"
          description="Quick access to the groups you are tracking most closely."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {watchlists.map((watchlist) => (
            <Card
              key={watchlist.id}
              className="rounded-3xl transition-transform hover:-translate-y-0.5"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      {watchlist.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {watchlist.description}
                    </CardDescription>
                  </div>
                  <ChangePill value={watchlist.dailyChange} />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Stocks</p>
                    <p className="font-medium">{watchlist.stocksCount}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-muted-foreground">Leading ticker</p>
                    <p className="font-medium">{watchlist.topTicker}</p>
                  </div>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <Link href={`/watchlists/${watchlist.id}`}>
                    Open watchlist
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div>
          <SectionHeading
            icon={<TrendingUp className="h-4 w-4" />}
            title="Key Movers"
            description="A quick look at the stocks moving most in your universe."
          />

          <Card className="rounded-3xl">
            <CardContent className="p-3">
              <div className="space-y-2">
                {keyMovers.map((item) => (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between rounded-2xl px-3 py-3 hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{item.symbol}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {item.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{item.price}</p>
                      <p
                        className={`text-sm ${
                          item.change >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <SectionHeading
            icon={<Globe className="h-4 w-4" />}
            title="Major Indices"
            description="Broader market context to anchor your watchlist movements."
          />

          <Card className="rounded-3xl">
            <CardContent className="p-3">
              <div className="space-y-2">
                {majorIndices.map((item) => (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between rounded-2xl px-3 py-3 hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{item.symbol}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {item.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{item.price}</p>
                      <p
                        className={`text-sm ${
                          item.change >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <SectionHeading
          icon={<Newspaper className="h-4 w-4" />}
          title="Latest News"
          description="Curated headlines tied to your tracked themes and stocks."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {newsItems.map((item) => (
            <Card
              key={item.id}
              className="group rounded-3xl transition-transform hover:-translate-y-0.5"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="rounded-full">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>

                <CardTitle className="text-base leading-6">
                  {item.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {item.relatedTickers.map((ticker) => (
                    <Badge
                      key={ticker}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {ticker}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={getSentimentBadgeClass(item.sentiment)}
                  >
                    {item.sentiment}
                  </Badge>

                  <Button variant="ghost" size="sm" className="gap-1">
                    Read more
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          icon={<Brain className="h-4 w-4" />}
          title="AI Insights"
          description="Short, high-signal interpretations to help you focus on what matters."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiInsights.map((insight) => (
            <Card
              key={insight.id}
              className={`rounded-3xl border ${getInsightToneClass(insight.tone)}`}
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="rounded-2xl border bg-background p-2 text-muted-foreground">
                    {insight.tone === "positive" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : insight.tone === "negative" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>

                  <Badge variant="outline" className="rounded-full capitalize">
                    {insight.tone}
                  </Badge>
                </div>

                <h3 className="text-base font-semibold">{insight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
