"use client";

import { useRouter } from "next/navigation";
import { NotepadText } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WatchlistItemOut } from "@/schemas/watchlist";
import { environment } from "@/lib/utils/env";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type WatchlistDetailsItemCardProps = {
  item: WatchlistItemOut;
};

function formatNumber(
  value?: number | null,
  options?: Intl.NumberFormatOptions,
) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

function formatCurrency(value?: number | null, currency?: string | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatChange(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

function MetricCell({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-w-0 text-right">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`truncate font-medium ${className ?? ""}`}>{value}</p>
    </div>
  );
}

export function WatchlistDetailsItemCard({
  item,
}: WatchlistDetailsItemCardProps) {
  const router = useRouter();

  const logoUrl = `${environment.logoKitTickerApiUrl}/${item.symbol}?token=${environment.logoKitTickerApiToken}`;

  const tickerDetails = item.tickerDetails;

  const currency = tickerDetails?.currency ?? null;
  const lastPrice = tickerDetails?.lastPrice ?? null;
  const regularMarketChange = tickerDetails?.regularMarketChange ?? null;
  const regularMarketChangePercent =
    tickerDetails?.regularMarketChangePercent ?? null;

  const hasChange =
    regularMarketChange !== null && regularMarketChange !== undefined;

  const isPositive = hasChange && regularMarketChange >= 0;

  const changeClassName = !hasChange
    ? "text-muted-foreground"
    : isPositive
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";

  function handleNavigate() {
    router.push(`/platform/ticker/${item.symbol}`);
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-5 rounded-xl border bg-card px-4 py-3 text-sm transition-colors hover:bg-muted/40">
      <div
        role="button"
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleNavigate();
          }
        }}
        className="grid cursor-pointer grid-cols-6 items-center gap-4"
      >
        <div className="flex flex-row gap-3 w-lg">
          <Avatar className="h-10 w-10 rounded-xl border bg-background">
            <AvatarImage src={logoUrl} alt={`${item.symbol} logo`} />
            <AvatarFallback className="rounded-xl text-xs font-semibold">
              {item.symbol.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-semibold">{item.symbol}</p>
            {item.exchange ? (
              <p className="truncate text-xs text-muted-foreground">
                {item.exchange}
              </p>
            ) : null}
          </div>
        </div>

        <MetricCell label="Currency" value={currency ?? "—"} />

        <MetricCell label="Quantity" value={formatNumber(item.quantity)} />

        <MetricCell
          label="Last price"
          value={formatCurrency(lastPrice, currency)}
        />

        <MetricCell
          label="Change"
          value={formatChange(regularMarketChange)}
          className={changeClassName}
        />

        <MetricCell
          label="Change %"
          value={formatPercent(regularMarketChangePercent)}
          className={changeClassName}
        />
      </div>

      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label={`View ${item.symbol} note`}
              >
                <NotepadText className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Notes</TooltipContent>
        </Tooltip>

        <DialogContent className="min-w-lg">
          <DialogHeader>
            <DialogTitle>{item.symbol} note</DialogTitle>
            <DialogDescription>
              Notes attached to this watchlist item.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border bg-muted/30 p-4 text-sm">
            {item.note ? (
              <p className="whitespace-pre-wrap leading-relaxed">{item.note}</p>
            ) : (
              <p className="text-muted-foreground">
                No note has been added for this stock.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
