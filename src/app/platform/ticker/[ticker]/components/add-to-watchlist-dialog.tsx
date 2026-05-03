"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Loader2,
  Lock,
  Plus,
  Users,
  Globe,
  ListPlus,
} from "lucide-react";
import { toast } from "sonner";
import { LuEye } from "react-icons/lu";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { environment } from "@/lib/utils/env";
import { cn } from "@/lib/utils";
import {
  addItemToWatchlistClient,
  getMyWatchlistsClient,
} from "@/lib/data/client/watchlist";
import { CreateWatchlistDialog } from "@/components/create-watchlist/create-watchlist-dialog";
import type {
  AddWatchlistItem,
  GetMyWatchlistsResponse,
  Watchlist,
  WatchlistDetailOut,
} from "@/schemas/watchlist";

type WatchlistTickerPreview = {
  symbol: string;
};

type StockSummary = {
  symbol: string;
  market?: string | null;
  shortName?: string | null;
  longName?: string | null;
  currentPrice?: number | null;
  regularMarketPrice?: number | null;
  regularMarketChange?: number | null;
  regularMarketChangePercent?: number | null;
  postMarketChange?: number | null;
  postMarketChangePercent?: number | null;
  currency?: string | null;
};

type AddToWatchlistDialogProps = {
  stock: StockSummary;
};

type WatchlistSectionKey = "created" | "forked" | "shared" | "bookmarked";

const SECTION_LABELS: Record<WatchlistSectionKey, string> = {
  created: "Created",
  forked: "Forked",
  shared: "Shared",
  bookmarked: "Bookmarked",
};

function formatPrice(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function getVisibilityIcon(visibility: string) {
  const normalized = visibility.toLowerCase();

  if (normalized === "private") return <Lock className="h-3.5 w-3.5" />;
  if (normalized === "shared") return <Users className="h-3.5 w-3.5" />;

  return <Globe className="h-3.5 w-3.5" />;
}

function TickerAvatarGroup({
  tickers,
  maxVisible = 8,
}: {
  tickers: WatchlistTickerPreview[];
  maxVisible?: number;
}) {
  const visibleTickers = tickers.slice(0, maxVisible);
  const remainingCount = Math.max(tickers.length - maxVisible, 0);

  return (
    <div className="flex items-center">
      {visibleTickers.map((ticker, index) => {
        const logoUrl = `${environment.logoKitTickerApiUrl}/${ticker.symbol}?token=${environment.logoKitTickerApiToken}`;

        return (
          <div key={`${ticker.symbol}-${index}`} className="-ml-2 first:ml-0">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage src={logoUrl} alt={`${ticker.symbol} logo`} />
              <AvatarFallback className="text-[10px] font-medium">
                {ticker.symbol.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      })}

      {remainingCount > 0 ? (
        <div className="-ml-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
            +{remainingCount}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SelectedTickerCard({ stock }: { stock: StockSummary }) {
  const price = stock.currentPrice ?? stock.regularMarketPrice;
  const change = stock.regularMarketChange;
  const changePercent = stock.regularMarketChangePercent;
  const postMarketChange = stock.postMarketChange;
  const postMarketChangePercent = stock.postMarketChangePercent;
  const displayName = stock.shortName || stock.longName || "Unknown company";

  const logoUrl = `${environment.logoKitTickerApiUrl}/${stock.symbol}?token=${environment.logoKitTickerApiToken}`;

  return (
    <div className="rounded-2xl border bg-card/60 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-12 w-12 rounded-full border">
            <AvatarImage src={logoUrl} alt={`${stock.symbol} logo`} />
            <AvatarFallback className="rounded-xl text-sm font-semibold">
              {stock.symbol.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-xl font-extrabold">{stock.symbol}</p>
              <Badge variant="outline" className="rounded-full">
                {stock.market}
              </Badge>
            </div>

            <p className="truncate text-sm text-muted-foreground">
              {displayName}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-baseline gap-2 justify-end">
            <p className="text-xl font-extrabold">{formatPrice(price)}</p>
            <p className="text-md text-muted-foreground">
              {stock.currency ? ` ${stock.currency}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-1 justify-end">
            {change !== null &&
            change !== undefined &&
            changePercent !== null &&
            changePercent !== undefined ? (
              <Badge
                variant="ticker"
                className={cn(
                  "rounded-3xl px-3 py-1",
                  change > 0 ? "bg-green-500/10" : "bg-red-500/10",
                )}
              >
                <div className="flex items-center gap-1 justify-end">
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      change > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {change >= 0 ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
                    {Math.abs(change).toFixed(2)}
                  </p>
                  <p
                    className={cn(
                      "text-md font-bold",
                      changePercent > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    ({changePercent >= 0 ? "+" : "-"}
                    {Math.abs(changePercent).toFixed(2)}
                    &#37;)
                  </p>
                  <p
                    className={cn(
                      "text-md",
                      changePercent > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    At close
                  </p>
                </div>
              </Badge>
            ) : null}

            {postMarketChange !== null &&
            postMarketChange !== undefined &&
            postMarketChangePercent !== null &&
            postMarketChangePercent !== undefined ? (
              <Badge
                variant="ticker"
                className={cn(
                  "rounded-3xl px-3 py-1",
                  postMarketChange > 0 ? "bg-green-500/10" : "bg-red-500/10",
                )}
              >
                <div className="flex items-center gap-1 justify-end">
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      postMarketChange > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {postMarketChange >= 0 ? (
                      <BiSolidUpArrow />
                    ) : (
                      <BiSolidDownArrow />
                    )}
                    {Math.abs(postMarketChange).toFixed(2)}
                  </p>
                  <p
                    className={cn(
                      "text-md font-bold",
                      postMarketChangePercent > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    ({postMarketChangePercent >= 0 ? "+" : "-"}
                    {Math.abs(postMarketChangePercent).toFixed(2)}&#37;)
                  </p>
                  <p
                    className={cn(
                      "text-md",
                      postMarketChangePercent > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    After hours
                  </p>
                </div>
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyWatchlistsState({
  onCreated,
  stock,
}: {
  onCreated: () => void | Promise<void>;
  stock: StockSummary;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center">
      <div className="mb-4 rounded-2xl bg-muted p-3">
        <ListPlus className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">No watchlists yet</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Create your first watchlist to start saving stocks and organising your
        ideas.
      </p>

      <div className="mt-6">
        <CreateWatchlistDialog
          isIconOnly={false}
          initialSeedItems={[
            {
              symbol: stock.symbol,
              displayName: stock.shortName,
              longName: stock.longName,
              currency: stock.currency,
              regularMarketPrice:
                stock.currentPrice ?? stock.regularMarketPrice,
              regularMarketChange: stock.regularMarketChange,
            },
          ]}
        />
      </div>
    </div>
  );
}

function WatchlistTypeBadge({ type }: { type: WatchlistSectionKey }) {
  return (
    <Badge variant="secondary" className="rounded-full">
      {SECTION_LABELS[type]}
    </Badge>
  );
}

function AddItemDetailsDialog({
  open,
  onOpenChange,
  watchlist,
  stock,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchlist: WatchlistDetailOut;
  stock: StockSummary;
  onSubmitted: () => void;
}) {
  const [quantity, setQuantity] = useState<string>("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quantityLabel =
    watchlist.allocationType === "percentage" ? "Allocation (%)" : "Units";

  useEffect(() => {
    if (!open) {
      setQuantity("");
      setNote("");
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    const parsedQuantity =
      quantity.trim() === "" ? null : Number.parseFloat(quantity);

    if (quantity.trim() !== "" && Number.isNaN(parsedQuantity ?? NaN)) {
      toast.error(`Please enter a valid ${quantityLabel.toLowerCase()}.`);
      return;
    }

    const payload: AddWatchlistItem = {
      symbol: stock.symbol,
      exchange: stock.market ?? "",
      note: note.trim() || null,
      position: watchlist.items.length,
      quantity: parsedQuantity,
      referencePrice: stock.currentPrice ?? stock.regularMarketPrice ?? null,
    };

    try {
      setIsSubmitting(true);

      await addItemToWatchlistClient(watchlist.id, payload);

      toast.success(`${stock.symbol} added to "${watchlist.name}"`);
      onOpenChange(false);
      onSubmitted();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to add ${stock.symbol} to "${watchlist.name}"`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add to {watchlist.name}</DialogTitle>
          <DialogDescription>
            Set the{" "}
            {watchlist.allocationType === "percentage" ? "allocation" : "units"}{" "}
            and optionally add a note for {stock.symbol}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{stock.symbol}</p>
                <p className="text-sm text-muted-foreground">
                  {stock.shortName || stock.longName || "Unknown company"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(stock.currentPrice ?? stock.regularMarketPrice)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stock.currency ?? ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">{quantityLabel}</label>
            <Input
              type="number"
              step={watchlist.allocationType === "percentage" ? "0.01" : "1"}
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={
                watchlist.allocationType === "percentage" ? "e.g. 10" : "e.g. 5"
              }
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Note (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a short note or reason..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding
              </>
            ) : (
              "Add item"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WatchlistRow({
  watchlist,
  watchlistType,
  stock,
  onAdded,
}: {
  watchlist: WatchlistDetailOut;
  watchlistType: WatchlistSectionKey;
  stock: StockSummary;
  onAdded: () => void;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const alreadyExists = useMemo(() => {
    return watchlist.items.some(
      (item) => item.symbol.toUpperCase() === stock.symbol.toUpperCase(),
    );
  }, [watchlist.items, stock.symbol]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-2xl border p-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <p className="truncate font-medium">{watchlist.name}</p>

            <Badge variant="outline" className="gap-1 rounded-full">
              {getVisibilityIcon(watchlist.visibility)}
              {watchlist.visibility}
            </Badge>

            <WatchlistTypeBadge type={watchlistType} />
          </div>

          <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{watchlist.items.length} stocks</span>
          </div>

          <TickerAvatarGroup tickers={watchlist.items} />
        </div>

        <div className="shrink-0">
          <Button
            type="button"
            variant={alreadyExists ? "secondary" : "default"}
            onClick={() => {
              if (!alreadyExists) setIsDetailsOpen(true);
            }}
            disabled={alreadyExists}
            className="rounded-xl"
          >
            {alreadyExists ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>

      <AddItemDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        watchlist={watchlist}
        stock={stock}
        onSubmitted={onAdded}
      />
    </>
  );
}

function WatchlistSection({
  title,
  type,
  watchlists,
  stock,
  onAdded,
}: {
  title: string;
  type: WatchlistSectionKey;
  watchlists: WatchlistDetailOut[];
  stock: StockSummary;
  onAdded: () => void;
}) {
  if (!watchlists.length) return null;

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      </div>

      {watchlists.map((watchlist) => (
        <WatchlistRow
          key={`${type}-${watchlist.id}`}
          watchlist={watchlist}
          watchlistType={type}
          stock={stock}
          onAdded={onAdded}
        />
      ))}
    </div>
  );
}

export default function AddToWatchlistDialog({
  stock,
}: AddToWatchlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [watchlistsResponse, setWatchlistsResponse] =
    useState<GetMyWatchlistsResponse | null>(null);

  const hasAnyWatchlists = useMemo(() => {
    if (!watchlistsResponse?.results) return false;

    const { created, forked, shared, bookmarked } = watchlistsResponse.results;

    return (
      created.length > 0 ||
      forked.length > 0 ||
      shared.length > 0 ||
      bookmarked.length > 0
    );
  }, [watchlistsResponse]);

  async function loadWatchlists() {
    try {
      setLoading(true);
      const res = await getMyWatchlistsClient();
      setWatchlistsResponse(res);
    } catch (error) {
      console.error(error);
      setWatchlistsResponse(null);
      toast.error("Failed to load watchlists");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    void loadWatchlists();
  }, [open]);

  const grouped = watchlistsResponse?.results;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded-xl p-2">
          <LuEye />
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-3xl max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add to watchlist</DialogTitle>
          <DialogDescription asChild>
            <div className="pt-2">
              <SelectedTickerCard stock={stock} />
            </div>
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-112 pr-3">
          <div className="space-y-5">
            {loading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-2xl border p-4">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                      <div className="flex gap-2">
                        {Array.from({ length: 6 }).map((__, avatarIndex) => (
                          <Skeleton
                            key={avatarIndex}
                            className="h-8 w-8 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : !hasAnyWatchlists ? (
              <EmptyWatchlistsState onCreated={loadWatchlists} stock={stock} />
            ) : (
              <>
                <WatchlistSection
                  title="Created"
                  type="created"
                  watchlists={grouped?.created ?? []}
                  stock={stock}
                  onAdded={loadWatchlists}
                />

                <WatchlistSection
                  title="Forked"
                  type="forked"
                  watchlists={grouped?.forked ?? []}
                  stock={stock}
                  onAdded={loadWatchlists}
                />

                <WatchlistSection
                  title="Shared"
                  type="shared"
                  watchlists={grouped?.shared ?? []}
                  stock={stock}
                  onAdded={loadWatchlists}
                />

                <WatchlistSection
                  title="Bookmarked"
                  type="bookmarked"
                  watchlists={grouped?.bookmarked ?? []}
                  stock={stock}
                  onAdded={loadWatchlists}
                />
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
