"use client";

import { useRouter } from "next/navigation";
import { Loader2, Trash2, TrendingDown, TrendingUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { environment } from "@/lib/utils/env";
import type { FavouriteStockResponse } from "@/schemas/favouriteStock";
import { cn } from "@/lib/utils";

type SidebarFavouriteStockCardProps = {
  stock: FavouriteStockResponse;
  onRemove: (id: number) => void | Promise<void>;
  isRemoving?: boolean;
};

function getTickerDetails(stock: FavouriteStockResponse): any {
  return stock.tickerDetails ?? (stock as any).ticker_details ?? null;
}

function getLastPrice(stock: FavouriteStockResponse): number | null {
  const tickerDetails = getTickerDetails(stock);

  return (
    tickerDetails?.lastPrice ??
    tickerDetails?.last_price ??
    tickerDetails?.regularMarketPrice ??
    tickerDetails?.regular_market_price ??
    null
  );
}

function getChange(stock: FavouriteStockResponse): number | null {
  const tickerDetails = getTickerDetails(stock);

  return (
    tickerDetails?.regularMarketChange ??
    tickerDetails?.regular_market_change ??
    null
  );
}

function getChangePercent(stock: FavouriteStockResponse): number | null {
  const tickerDetails = getTickerDetails(stock);

  return (
    tickerDetails?.regularMarketChangePercent ??
    tickerDetails?.regular_market_change_percent ??
    null
  );
}

function getMarket(stock: FavouriteStockResponse): string {
  const tickerDetails = getTickerDetails(stock);

  return (
    stock.exchange ??
    (stock as any).market ??
    tickerDetails?.exchange ??
    tickerDetails?.market ??
    "—"
  );
}

function getCurrency(stock: FavouriteStockResponse): string {
  const tickerDetails = getTickerDetails(stock);

  return tickerDetails?.currency ?? "USD";
}

function formatPrice(value: number | null, currency: string) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatChange(value: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

function formatPercent(value: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function SidebarFavouriteStockCard({
  stock,
  onRemove,
  isRemoving = false,
}: SidebarFavouriteStockCardProps) {
  const router = useRouter();

  const logoUrl = `${environment.logoKitTickerApiUrl}/${stock.symbol}?token=${environment.logoKitTickerApiToken}`;

  const market = getMarket(stock);
  const currency = getCurrency(stock);
  const lastPrice = getLastPrice(stock);
  const change = getChange(stock);
  const changePercent = getChangePercent(stock);

  const hasChange = typeof change === "number" && !Number.isNaN(change);
  const isPositive = hasChange && change >= 0;

  const changeClassName = !hasChange
    ? "text-muted-foreground"
    : isPositive
      ? "text-emerald-600"
      : "text-rose-600";

  function handleNavigate() {
    router.push(`/platform/ticker/${stock.symbol}`);
  }

  async function handleRemove(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    await onRemove(stock.id);
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/50">
      <button
        type="button"
        onClick={handleNavigate}
        className="grid min-w-0 grid-cols-[auto_minmax(4.5rem,1fr)_minmax(4.5rem,0.8fr)_minmax(4rem,0.7fr)_minmax(4rem,0.7fr)] items-center gap-3 text-left"
      >
        <Avatar className="h-8 w-8 rounded-xl border bg-background">
          <AvatarImage src={logoUrl} alt={`${stock.symbol} logo`} />
          <AvatarFallback className="rounded-xl text-[10px] font-semibold">
            {stock.symbol.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{stock.symbol}</div>
          <div className="truncate text-xs text-muted-foreground">{market}</div>
        </div>

        <div className="min-w-0 text-right">
          <div className="truncate text-[10px] text-muted-foreground">Last</div>
          <div className="truncate text-sm font-medium">
            {formatPrice(lastPrice, currency)}
          </div>
        </div>

        <div className="min-w-0 text-right">
          <div className="truncate text-[10px] text-muted-foreground">Chg</div>
          <div className={cn("truncate text-xs font-medium", changeClassName)}>
            {formatChange(change)}
          </div>
        </div>

        <div className="min-w-0 text-right">
          <div className="truncate text-[10px] text-muted-foreground">
            Chg %
          </div>
          <div
            className={cn(
              "flex items-center justify-end gap-1 truncate text-xs font-medium",
              changeClassName,
            )}
          >
            {hasChange ? (
              isPositive ? (
                <TrendingUp className="h-3 w-3 shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 shrink-0" />
              )
            ) : null}
            <span className="truncate">{formatPercent(changePercent)}</span>
          </div>
        </div>
      </button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
        disabled={isRemoving}
        onClick={handleRemove}
        aria-label={`Remove ${stock.symbol} from favourites`}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
