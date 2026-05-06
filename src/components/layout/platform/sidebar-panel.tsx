"use client";

import { Heart, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useWatchlists } from "@/providers/watchlist-provider";
import { SidebarWatchlistCard } from "./components/sidebar-watchlist-card";
import { useFavouriteStocks } from "@/providers/favourite-stocks-provider";

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

function FavouriteStocksList() {
  const { favouriteStocks, loading } = useFavouriteStocks();

  if (loading && favouriteStocks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading favourite stocks...
      </div>
    );
  }

  if (!favouriteStocks.length) {
    return (
      <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        No favourite stocks yet.
      </div>
    );
  }

  return (
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
              {stock.symbol}
            </div>
          </div>

          <div className="text-right">
            {stock.tickerDetails.last_price && (
              <div className="text-sm font-medium">
                {stock.tickerDetails.last_price}
              </div>
            )}
            {stock.tickerDetails.regular_market_change && (
              <div
                className={
                  stock.tickerDetails.regular_market_change >= 0
                    ? "text-xs text-emerald-600"
                    : "text-xs text-rose-600"
                }
              >
                {stock.tickerDetails.regular_market_change >= 0 ? "+" : ""}
                {stock.tickerDetails.regular_market_change.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarWatchlistsList() {
  const { watchlists, loading } = useWatchlists();

  if (loading && watchlists.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading watchlists...
      </div>
    );
  }

  if (!watchlists.length) {
    return (
      <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        No watchlists yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {watchlists.map((watchlist) => (
        <SidebarWatchlistCard
          key={watchlist.id}
          watchlist={watchlist}
          isOwnProfile={true}
          onRefresh={() => {}}
        />
      ))}
    </div>
  );
}

export function SidebarPanel() {
  return (
    <Card className="flex h-full min-h-0 flex-col rounded-3xl p-0">
      <CardContent className="min-h-0 flex-1 p-0">
        <ResizablePanelGroup orientation="vertical" className="h-full min-h-0">
          <ResizablePanel defaultSize={55} minSize={30}>
            <SidebarSection title="Favourite Stocks">
              <FavouriteStocksList />
            </SidebarSection>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={45} minSize={25}>
            <SidebarSection title="Watchlists">
              <SidebarWatchlistsList />
            </SidebarSection>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
