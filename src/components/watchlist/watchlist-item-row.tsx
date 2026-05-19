"use client";

import { Check, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScreenerTickerInfo } from "@/schemas/screener";
import { environment } from "@/lib/utils/env";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { QuoteResult } from "@/schemas/search";
import { WatchlistRowItem } from "@/schemas/watchlist";

type WatchlistItemRowProps = {
  item: WatchlistRowItem;
  selected: boolean;
  quantityType: string;
  allocationValue?: string | number | null;
  noteValue?: string;
  onToggle: (item: WatchlistRowItem) => void;
  onAllocationChange?: (symbol: string, value: string) => void;
  onNoteChange?: (symbol: string, value: string) => void;
};

function calculateChangePercent(
  change?: number | null,
  previousClose?: number | null,
): number | null {
  if (change == null || previousClose == null || previousClose === 0) {
    return null;
  }

  return (change / previousClose) * 100;
}

export function quoteResultToWatchlistRowItem(
  item: QuoteResult,
): WatchlistRowItem {
  return {
    symbol: item.symbol,
    displayName: item.shortname || item.longname || item.symbol,
    exchange: item.exchange || item.exchDisp || null,
    currency: item.currency || null,
    marketPrice: item.lastPrice ?? null,
    marketChange: item.regularMarketChange ?? null,
    marketChangePercent:
      item.regularMarketChangePercent ??
      calculateChangePercent(
        item.regularMarketChange,
        item.regularMarketPreviousClose ?? item.previousClose,
      ),
  };
}

export function screenerTickerInfoToWatchlistRowItem(
  item: ScreenerTickerInfo,
): WatchlistRowItem {
  return {
    symbol: item.symbol,
    displayName: item.displayName || item.longName || item.symbol,
    exchange: item.exchange ?? null,
    currency: item.currency ?? null,
    marketPrice: item.regularMarketPrice ?? null,
    marketChange: item.regularMarketChange ?? null,
    marketChangePercent: calculateChangePercent(
      item.regularMarketChange,
      item.regularMarketPreviousClose,
    ),
  };
}

export function WatchlistItemRow({
  item,
  selected,
  quantityType,
  allocationValue,
  noteValue,
  onToggle,
  onAllocationChange,
  onNoteChange,
}: WatchlistItemRowProps) {
  const isPositive = (item.marketChange ?? 0) >= 0;

  const logoUrl = `${environment.logoKitTickerApiUrl}/${item.symbol}?token=${environment.logoKitTickerApiToken}`;
  const displayName = item.displayName || item.symbol;
  const regularMarketChangePercent = item.marketChangePercent;

  const allocationLabel =
    quantityType === "percentage" ? "Percentage" : "Units";
  const allocationSuffix = quantityType === "percentage" ? "%" : "";

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition",
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/40",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
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

          <div className="min-w-0 flex-1">
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
              {typeof item.marketPrice === "number" ? (
                <span>
                  {item.currency} {item.marketPrice.toFixed(2)}
                </span>
              ) : null}

              <span
                className={cn(
                  "inline-flex items-center gap-1",
                  isPositive ? "text-emerald-600" : "text-red-600",
                )}
              >
                {item.marketChange != null
                  ? `${isPositive ? "+" : ""}${item.marketChange.toFixed(2)}`
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
                  {regularMarketChangePercent?.toFixed(2)}%
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-2">
          {selected ? (
            <div className="flex w-36 items-center gap-2">
              <Input
                type="number"
                min={0}
                step={quantityType === "percentage" ? "0.01" : "1"}
                value={allocationValue ?? ""}
                onChange={(e) =>
                  onAllocationChange?.(item.symbol, e.target.value)
                }
                placeholder={allocationLabel}
                className="h-9"
              />
              {allocationSuffix ? (
                <span className="text-sm text-muted-foreground">
                  {allocationSuffix}
                </span>
              ) : null}
            </div>
          ) : null}

          <Button
            type="button"
            variant={selected ? "default" : "outline"}
            size="icon"
            onClick={() => onToggle(item)}
            aria-label={
              selected ? `Remove ${item.symbol}` : `Add ${item.symbol}`
            }
            className="shrink-0"
          >
            {selected ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {selected ? (
        <div className="mt-3">
          <Input
            value={noteValue ?? ""}
            onChange={(e) => onNoteChange?.(item.symbol, e.target.value)}
            placeholder="Optional note for this item"
            maxLength={300}
          />
        </div>
      ) : null}
    </div>
  );
}
