"use client";

import { Heart, TrendingDown, TrendingUp } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type StockItem = {
  symbol: string;
  logo?: string;
};

type Watchlist = {
  name: string;
  stocks: StockItem[];
  change: number;
};

const favouriteStocks = [
  { symbol: "AAPL", name: "Apple", price: "$213.21", change: 1.18 },
  { symbol: "NVDA", name: "NVIDIA", price: "$943.20", change: 3.82 },
  { symbol: "MSFT", name: "Microsoft", price: "$428.61", change: 1.14 },
  { symbol: "TSLA", name: "Tesla", price: "$188.44", change: -1.64 },
  { symbol: "PLTR", name: "Palantir", price: "$31.87", change: 4.29 },
];

const watchlists: Watchlist[] = [
  {
    name: "Tech Giants",
    stocks: [
      { symbol: "AAPL" },
      { symbol: "MSFT" },
      { symbol: "NVDA" },
      { symbol: "GOOGL" },
      { symbol: "AMZN" },
      { symbol: "META" },
      { symbol: "TSM" },
    ],
    change: 2.34,
  },
  {
    name: "Dividend Picks",
    stocks: [
      { symbol: "KO" },
      { symbol: "PG" },
      { symbol: "JNJ" },
      { symbol: "PEP" },
      { symbol: "MCD" },
      { symbol: "HD" },
    ],
    change: -0.82,
  },
  {
    name: "AI & Chips",
    stocks: [
      { symbol: "NVDA" },
      { symbol: "AMD" },
      { symbol: "SMCI" },
      { symbol: "AVGO" },
      { symbol: "TSM" },
      { symbol: "ARM" },
    ],
    change: 4.91,
  },
];

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <Badge
      variant="secondary"
      className={
        positive
          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
          : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/10"
      }
    >
      {positive ? (
        <TrendingUp className="mr-1 h-3.5 w-3.5" />
      ) : (
        <TrendingDown className="mr-1 h-3.5 w-3.5" />
      )}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </Badge>
  );
}

function WatchlistAvatarGroup({ stocks }: { stocks: StockItem[] }) {
  const visible = stocks.slice(0, 5);
  const remaining = Math.max(stocks.length - visible.length, 0);

  return (
    <AvatarGroup>
      {visible.map((stock) => (
        <Avatar key={stock.symbol} className="h-8 w-8 border border-background">
          <AvatarImage src={stock.logo} alt={stock.symbol} />
          <AvatarFallback className="text-[10px] font-semibold">
            {stock.symbol.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 ? <AvatarGroupCount>+{remaining}</AvatarGroupCount> : null}
    </AvatarGroup>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <div className="min-h-0 flex-1 px-2 pb-2">
        <ScrollArea className="h-full pr-2">{children}</ScrollArea>
      </div>
    </div>
  );
}

export function SidebarPanel() {
  return (
    <Card className="flex h-full min-h-0 flex-col rounded-3xl p-0">
      <CardContent className="min-h-0 flex-1 p-0">
        <ResizablePanelGroup orientation="vertical" className="h-full min-h-0">
          <ResizablePanel defaultSize="55%" minSize="30%">
            <SidebarSection title="Favourite Stocks">
              <div className="space-y-2">
                {favouriteStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between rounded-2xl px-3 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{stock.symbol}</span>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {stock.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium">{stock.price}</div>
                      <div
                        className={`text-xs ${
                          stock.change >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize="45%" minSize="25%">
            <SidebarSection title="Watchlists">
              <div className="space-y-2">
                {watchlists.map((watchlist) => (
                  <div
                    key={watchlist.name}
                    className="rounded-2xl border px-3 py-3"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium">{watchlist.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {watchlist.stocks.length} stocks
                        </div>
                      </div>

                      <ChangeBadge value={watchlist.change} />
                    </div>

                    <WatchlistAvatarGroup stocks={watchlist.stocks} />
                  </div>
                ))}
              </div>
            </SidebarSection>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
