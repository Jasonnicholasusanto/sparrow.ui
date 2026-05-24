"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Info,
  Loader2,
  Pencil,
  NotepadText,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateWatchlistItem, WatchlistItemOut } from "@/schemas/watchlist";
import { getLogoUrl } from "@/lib/utils/tickerLogo";

type WatchlistDetailsItemCardProps = {
  item: WatchlistItemOut;
  onRemove?: (itemId: number) => Promise<void> | void;
  onUpdate?: (payload: UpdateWatchlistItem) => Promise<void> | void;
  onNavigate?: () => void;
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

function MetricCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 truncate text-lg font-semibold ${valueClassName ?? ""}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-medium ${valueClassName ?? ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export function WatchlistDetailsItemCard({
  item,
  onRemove,
  onUpdate,
  onNavigate,
}: WatchlistDetailsItemCardProps) {
  const router = useRouter();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [updateOpen, setUpdateOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [quantity, setQuantity] = useState(
    item.quantity !== null && item.quantity !== undefined
      ? String(item.quantity)
      : "",
  );

  const [note, setNote] = useState(item.note ?? "");

  const logoUrl = getLogoUrl(item.symbol);

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
    setDetailsOpen(false);
    setNoteOpen(false);
    setUpdateOpen(false);
    onNavigate?.();
    router.push(`/platform/ticker/${item.symbol}`);
  }

  async function handleRemove() {
    if (!onRemove) return;

    try {
      setRemoving(true);
      await onRemove(item.id);
    } finally {
      setRemoving(false);
    }
  }

  async function handleUpdate() {
    if (!onUpdate) return;

    const parsedQuantity = quantity.trim() === "" ? null : Number(quantity);

    if (
      parsedQuantity !== null &&
      (Number.isNaN(parsedQuantity) || parsedQuantity < 0)
    ) {
      return;
    }

    const payload: UpdateWatchlistItem = {
      quantity: parsedQuantity,
      note: note.trim() === "" ? null : note.trim(),
    };

    try {
      setUpdating(true);

      await onUpdate(payload);

      setUpdateOpen(false);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
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
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <div className="flex w-lg flex-row gap-3">
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
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{tickerDetails?.tickerName}</p>
                </TooltipContent>
              </Tooltip>

              <MetricCell label="Currency" value={currency ?? "—"} />

              <MetricCell
                label="Quantity"
                value={formatNumber(item.quantity)}
              />

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

            <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
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
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {item.note}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No note has been added for this stock.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-56">
          <ContextMenuGroup>
            <ContextMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleNavigate();
              }}
            >
              <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
              View {item.symbol}
            </ContextMenuItem>

            <ContextMenuItem
              onSelect={(event) => {
                event.preventDefault();
                setDetailsOpen(true);
              }}
            >
              <Info className="mr-2 h-4 w-4" />
              View Details
            </ContextMenuItem>
          </ContextMenuGroup>

          <ContextMenuItem
            disabled={!onUpdate}
            onSelect={(event) => {
              event.preventDefault();
              setQuantity(
                item.quantity !== null && item.quantity !== undefined
                  ? String(item.quantity)
                  : "",
              );
              setNote(item.note ?? "");
              setUpdateOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Update {item.symbol}
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuGroup>
            <ContextMenuItem
              variant="destructive"
              disabled={removing || !onRemove}
              onSelect={(event) => {
                event.preventDefault();
                void handleRemove();
              }}
            >
              {removing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from watchlist
                </>
              )}
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-5xl min-w-4xl rounded-3xl">
          <div className="border-b py-4">
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-5">
                  <Avatar className="w-13 h-13">
                    <AvatarImage
                      src={logoUrl}
                      alt={`${item.tickerDetails?.tickerName || item.symbol} logo`}
                      loading="lazy"
                    />
                    <AvatarFallback className="text-xs font-medium">
                      {item.symbol?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-bold tracking-tight">
                      {item.tickerDetails?.tickerName || item.symbol}
                    </h1>
                    <div className="flex items-center gap-1.5">
                      <p className="text-muted-foreground text-xs">
                        {item.symbol}
                      </p>
                      <p className="text-muted-foreground text-xs">&bull;</p>
                      <p className="text-muted-foreground text-xs">
                        {item.exchange || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold">
                    {formatCurrency(lastPrice, currency)}
                  </p>

                  <div
                    className={`mt-1 flex items-center justify-end gap-2 text-sm font-medium ${changeClassName}`}
                  >
                    <span>{formatChange(regularMarketChange)}</span>
                    <span>{formatPercent(regularMarketChangePercent)}</span>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Market value"
                value={formatCurrency(
                  item.positionDetails?.marketValue,
                  currency,
                )}
              />

              <MetricCard
                label="Quantity"
                value={formatNumber(item.quantity)}
              />

              <MetricCard
                label="Last price"
                value={formatCurrency(lastPrice, currency)}
              />

              <MetricCard
                label="Day change"
                value={formatCurrency(
                  item.positionDetails?.dayChangeValue,
                  currency,
                )}
                valueClassName={changeClassName}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-card p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold">Position details</h4>
                  <p className="text-xs text-muted-foreground">
                    Based on your saved quantity and the latest market snapshot.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <DetailRow
                    label="Quantity"
                    value={formatNumber(item.quantity)}
                  />

                  <DetailRow
                    label="Market value"
                    value={formatCurrency(
                      item.positionDetails?.marketValue,
                      currency,
                    )}
                  />

                  <DetailRow
                    label="Previous value"
                    value={formatCurrency(
                      item.positionDetails?.previousMarketValue,
                      currency,
                    )}
                  />

                  <DetailRow
                    label="Day change"
                    value={formatCurrency(
                      item.positionDetails?.dayChangeValue,
                      currency,
                    )}
                    valueClassName={changeClassName}
                  />

                  <DetailRow
                    label="Day change %"
                    value={formatPercent(
                      item.positionDetails?.dayChangePercent ??
                        regularMarketChangePercent,
                    )}
                    valueClassName={changeClassName}
                  />
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-4">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold">Market snapshot</h4>
                  <p className="text-xs text-muted-foreground">
                    Latest available price data for this ticker.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <DetailRow label="Symbol" value={item.symbol} />

                  <DetailRow label="Exchange" value={item.exchange ?? "—"} />

                  <DetailRow label="Currency" value={currency ?? "—"} />

                  <DetailRow
                    label="Last price"
                    value={formatCurrency(lastPrice, currency)}
                  />

                  <DetailRow
                    label="Previous close"
                    value={formatCurrency(
                      item.tickerDetails?.previousClose,
                      currency,
                    )}
                  />

                  <DetailRow
                    label="Volume"
                    value={formatNumber(item.tickerDetails?.volume)}
                  />
                </div>
              </div>
            </div>

            {item.note ? (
              <div className="rounded-2xl border bg-muted/30 p-4">
                <h4 className="mb-2 text-sm font-semibold">Note</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.note}
                </p>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="min-w-lg">
          <DialogHeader>
            <DialogTitle>Update {item.symbol}</DialogTitle>
            <DialogDescription>
              Update the quantity and note for this watchlist item.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
              <Input
                id={`quantity-${item.id}`}
                type="number"
                min="0"
                step="any"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Enter quantity"
                disabled={updating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`note-${item.id}`}>Note</Label>
              <Textarea
                id={`note-${item.id}`}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add a note about this stock..."
                disabled={updating}
                className="min-h-32 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUpdateOpen(false)}
                disabled={updating}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={() => void handleUpdate()}
                disabled={updating || !onUpdate}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update item"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
