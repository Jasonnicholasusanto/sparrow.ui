"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { WatchlistDetailOut } from "@/schemas/watchlist";
import { environment } from "@/lib/utils/env";
import { WatchlistDetailsDialog } from "@/app/platform/trader/[username]/components/watchlist-details-dialog";

type SidebarWatchlistCardProps = {
  watchlist: WatchlistDetailOut;
  isOwnProfile: boolean;
  onRefresh: () => void | Promise<void>;
};

type WatchlistItemLike = NonNullable<WatchlistDetailOut["items"]>[number];

function getTickerDetails(item: WatchlistItemLike): any {
  return (item as any).tickerDetails ?? (item as any).ticker_details ?? null;
}

function getItemChangePercent(item: WatchlistItemLike): number | null {
  const tickerDetails = getTickerDetails(item);

  const directChangePercent =
    tickerDetails?.regularMarketChangePercent ??
    tickerDetails?.regular_market_change_percent ??
    null;

  if (typeof directChangePercent === "number") {
    return directChangePercent;
  }

  const change =
    tickerDetails?.regularMarketChange ??
    tickerDetails?.regular_market_change ??
    null;

  const previousClose =
    tickerDetails?.regularMarketPreviousClose ??
    tickerDetails?.regular_market_previous_close ??
    tickerDetails?.previousClose ??
    tickerDetails?.previous_close ??
    null;

  if (
    typeof change !== "number" ||
    typeof previousClose !== "number" ||
    previousClose === 0
  ) {
    return null;
  }

  return (change / previousClose) * 100;
}

function getAverageChangePercent(items: WatchlistItemLike[]): number | null {
  const values = items
    .map(getItemChangePercent)
    .filter((value): value is number => typeof value === "number");

  if (!values.length) return null;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getVisibilityLabel(visibility?: string | null) {
  if (!visibility) return "Unknown";

  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

function getLogoUrl(symbol: string) {
  return `${environment.logoKitTickerApiUrl}/${symbol}?token=${environment.logoKitTickerApiToken}`;
}

function ChangeBadge({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <Badge variant="secondary" className="shrink-0">
        —
      </Badge>
    );
  }

  const positive = value >= 0;

  return (
    <Badge
      variant="secondary"
      className={
        positive
          ? "shrink-0 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
          : "shrink-0 bg-rose-500/10 text-rose-600 hover:bg-rose-500/10"
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

function WatchlistAvatarGroup({ items }: { items: WatchlistItemLike[] }) {
  const visible = items.slice(0, 7);
  const remaining = Math.max(items.length - visible.length, 0);

  return (
    <AvatarGroup>
      {visible.map((item) => {
        const symbol = item.symbol;

        return (
          <Avatar
            key={`${item.id}-${symbol}`}
            className="h-8 w-8 border border-background"
          >
            <AvatarImage src={getLogoUrl(symbol)} alt={`${symbol} logo`} />
            <AvatarFallback className="text-[10px] font-semibold">
              {symbol.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      })}

      {remaining > 0 ? <AvatarGroupCount>+{remaining}</AvatarGroupCount> : null}
    </AvatarGroup>
  );
}

export function SidebarWatchlistCard({
  watchlist,
  isOwnProfile,
  onRefresh,
}: SidebarWatchlistCardProps) {
  const items = watchlist.items ?? [];
  const averageChangePercent = getAverageChangePercent(items);

  return (
    <WatchlistDetailsDialog
      watchlist={watchlist}
      isOwnProfile={isOwnProfile}
      onRefresh={onRefresh}
      trigger={
        <button
          type="button"
          className="w-full rounded-2xl border px-3 py-3 text-left transition-colors hover:bg-muted/40"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate font-medium">{watchlist.name}</p>

                <Badge
                  variant="outline"
                  className="shrink-0 rounded-full text-[10px]"
                >
                  {getVisibilityLabel(watchlist.visibility)}
                </Badge>
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                {items.length}{" "}
                {items.length === 1 ? "stock/fund" : "stocks/funds"}
              </div>
            </div>

            <ChangeBadge value={averageChangePercent} />
          </div>

          {items.length ? (
            <WatchlistAvatarGroup items={items} />
          ) : (
            <div className="rounded-xl border border-dashed px-3 py-2 text-xs text-muted-foreground">
              No items added
            </div>
          )}
        </button>
      }
    />
  );
}
