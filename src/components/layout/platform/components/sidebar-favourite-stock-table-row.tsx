import { environment } from "@/lib/utils/env";
import {
  formatChange,
  formatPercent,
  formatPrice,
} from "@/lib/utils/formatPrice";
import { FavouriteStockResponse } from "@/schemas/favouriteStock";
import { useRouter } from "next/dist/client/components/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { ListPlus, Loader2, SquareArrowOutUpRight } from "lucide-react";
import { AddToWatchlistDialog } from "@/app/platform/ticker/[ticker]/components/add-to-watchlist-dialog";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SidebarFavouriteStockTableRowProps = {
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

export function SidebarFavouriteStockTableRow({
  stock,
  onRemove,
  isRemoving = false,
}: SidebarFavouriteStockTableRowProps) {
  const router = useRouter();

  const logoUrl = `${environment.logoKitTickerApiUrl}/${stock.symbol}?token=${environment.logoKitTickerApiToken}`;

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
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <TableRow
              onClick={handleNavigate}
              className="cursor-pointer select-none"
            >
              <TableCell className="flex flex-row items-center gap-2">
                <Avatar className="h-7 w-7 rounded-xl border bg-background">
                  <AvatarImage src={logoUrl} alt={`${stock.symbol} logo`} />
                  <AvatarFallback className="rounded-xl text-md font-semibold">
                    {stock.symbol.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">
                    {stock.symbol}
                  </div>
                </div>
              </TableCell>

              <TableCell className={"truncate text-right text-xs font-medium"}>
                {lastPrice !== null ? formatPrice(lastPrice) : "—"}
              </TableCell>

              <TableCell
                className={cn(
                  "truncate text-right text-xs font-medium",
                  changeClassName,
                )}
              >
                {formatChange(change)}
              </TableCell>

              <TableCell
                className={cn(
                  "truncate text-right text-xs font-medium",
                  changeClassName,
                )}
              >
                {formatPercent(changePercent)}
              </TableCell>
            </TableRow>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{stock.tickerDetails.tickerName}</p>
          </TooltipContent>
        </Tooltip>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuItem
            onSelect={(event) => {
              event.preventDefault();
              handleNavigate();
            }}
          >
            <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
            View {stock.symbol}
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
            onSelect={(event) => {
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
