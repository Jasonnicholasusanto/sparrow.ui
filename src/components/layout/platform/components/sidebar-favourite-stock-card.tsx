"use client";

import { useRouter } from "next/navigation";
import {
  ListPlus,
  Loader2,
  SquareArrowOutUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { environment } from "@/lib/utils/env";
import type { FavouriteStockResponse } from "@/schemas/favouriteStock";
import { cn } from "@/lib/utils";
import { AddToWatchlistDialog } from "@/app/platform/ticker/[ticker]/components/add-to-watchlist-dialog";

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

  async function handleRemove() {
    await onRemove(stock.id);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          onClick={handleNavigate}
          className="grid w-full min-w-0 grid-cols-[minmax(6rem,1fr)_minmax(4.5rem,1fr)_minmax(4rem,1fr)_minmax(4rem,1fr)] items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex flex-row min-w-0 items-center gap-2">
            <Avatar className="h-7 w-7 rounded-xl border bg-background">
              <AvatarImage src={logoUrl} alt={`${stock.symbol} logo`} />
              <AvatarFallback className="rounded-xl text-[10px] font-semibold">
                {stock.symbol.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{stock.symbol}</div>
            </div>
          </div>

          <div className="truncate text-right text-xs font-medium">
            {lastPrice?.toFixed(2) ?? "—"}
          </div>

          <div
            className={cn(
              "truncate text-right text-xs font-medium",
              changeClassName,
            )}
          >
            {formatChange(change)}
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
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuItem onClick={handleNavigate}>
            <span className="flex items-center gap-2 text-xs">
              <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
              View {stock.symbol}
            </span>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuGroup>
          <AddToWatchlistDialog
            stock={{
              symbol: stock.symbol,
              market: stock.exchange,
              currency: stock.tickerDetails?.currency,
            }}
            trigger={
              <ContextMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                }}
              >
                <ListPlus className="mr-2 h-4 w-4" />
                Add to watchlist
              </ContextMenuItem>
            }
          />
        </ContextMenuGroup>

        <ContextMenuSeparator />

        <ContextMenuGroup>
          <ContextMenuItem
            variant="destructive"
            disabled={isRemoving}
            onClick={(event) => {
              event.preventDefault();
              void handleRemove();
            }}
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>Remove from favourites</>
            )}
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
