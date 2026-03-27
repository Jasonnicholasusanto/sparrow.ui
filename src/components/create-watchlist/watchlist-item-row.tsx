"use client";

import Image from "next/image";
import { Plus, Check, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WatchlistSeedItem = {
  symbol: string;
  name: string;
  exchange?: string | null;
  quoteType?: string | null;
  price?: number | null;
  changePercent?: number | null;
  currency?: string | null;
  logoUrl?: string | null;
};

type WatchlistItemRowProps = {
  item: WatchlistSeedItem;
  selected: boolean;
  onToggle: (item: WatchlistSeedItem) => void;
};

export function WatchlistItemRow({
  item,
  selected,
  onToggle,
}: WatchlistItemRowProps) {
  const isPositive = (item.changePercent ?? 0) >= 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border p-3 transition",
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/40",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
          {item.logoUrl ? (
            <Image
              src={item.logoUrl}
              alt={item.symbol}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              {item.symbol.slice(0, 2)}
            </span>
          )}
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

          <p className="truncate text-sm text-muted-foreground">{item.name}</p>

          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            {typeof item.price === "number" ? (
              <span>
                {item.currency ?? "USD"} {item.price.toFixed(2)}
              </span>
            ) : null}

            {typeof item.changePercent === "number" ? (
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
                {item.changePercent.toFixed(2)}%
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
