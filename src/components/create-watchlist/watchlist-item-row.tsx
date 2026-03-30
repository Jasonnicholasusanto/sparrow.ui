"use client";

import { Check, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScreenerTickerInfo } from "@/schemas/screener";
import { environment } from "@/lib/utils/env";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type WatchlistItemRowProps = {
  item: ScreenerTickerInfo;
  selected: boolean;
  onToggle: (item: ScreenerTickerInfo) => void;
};

export function WatchlistItemRow({
  item,
  selected,
  onToggle,
}: WatchlistItemRowProps) {
  const isPositive = (item.regularMarketChange ?? 0) >= 0;

  const logoUrl = `${environment.logoKitTickerApiUrl}/${item.symbol}?token=${environment.logoKitTickerApiToken}`;

  const displayName = item.displayName || item.longName || item.symbol;

  function getChangePercent(item: ScreenerTickerInfo): number | null {
    const change = item.regularMarketChange;
    const prevClose = item.regularMarketPreviousClose;

    if (change == null || prevClose == null || prevClose === 0) {
      return null;
    }

    return (change / prevClose) * 100;
  }

  const regularMarketChangePercent = getChangePercent(item);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border p-3 transition",
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/40",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={logoUrl}
              alt={`${displayName} logo`}
              className="object-cover"
            />
            <AvatarFallback className="text-xs font-medium">
              {item.symbol?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{item.symbol}</p>

            {item.exchange ? (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {item.exchange}
              </span>
            ) : null}
          </div>

          <p className="truncate text-sm text-muted-foreground">
            {displayName}
          </p>

          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            {typeof item.regularMarketPrice === "number" ? (
              <span>
                {item.currency ?? "USD"} {item.regularMarketPrice.toFixed(2)}
              </span>
            ) : null}

            <span
              className={cn(
                "inline-flex items-center gap-1",
                isPositive ? "text-emerald-600" : "text-red-600",
              )}
            >
              {item.regularMarketChange != null
                ? (isPositive ? "+" : "") + item.regularMarketChange.toFixed(2)
                : null}
            </span>

            {typeof regularMarketChangePercent === "number" ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1",
                  isPositive ? "text-emerald-600" : "text-red-600",
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {regularMarketChangePercent.toFixed(2)}%
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant={selected ? "default" : "outline"}
        size="icon"
        onClick={() => onToggle(item)}
        aria-label={selected ? `Remove ${item.symbol}` : `Add ${item.symbol}`}
        className="shrink-0"
      >
        {selected ? (
          <Check className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
