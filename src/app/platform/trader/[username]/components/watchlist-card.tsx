"use client";

import { Globe, Lock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WatchlistDetailOut } from "@/schemas/watchlist";
import { environment } from "@/lib/utils/env";
import { WatchlistDetailsDialog } from "./watchlist-details-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type WatchlistCardProps = {
  watchlist: WatchlistDetailOut;
  isOwnProfile: boolean;
  onRefresh: () => void | Promise<void>;
};

type WatchlistTickerPreview = {
  symbol: string;
};

function getVisibilityIcon(visibility: string) {
  const normalized = visibility.toLowerCase();

  if (normalized === "private") return <Lock className="h-3.5 w-3.5" />;
  if (normalized === "shared") return <Users className="h-3.5 w-3.5" />;
  return <Globe className="h-3.5 w-3.5" />;
}

function TickerAvatarGroup({
  tickers,
  maxVisible = 7,
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-background cursor-pointer">
                  <AvatarImage src={logoUrl} alt={`${ticker.symbol} logo`} />
                  <AvatarFallback className="text-[10px] font-medium">
                    {ticker.symbol.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>

              <TooltipContent>
                <p>{ticker.symbol}</p>
              </TooltipContent>
            </Tooltip>
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

export function WatchlistCard({
  watchlist,
  isOwnProfile,
  onRefresh,
}: WatchlistCardProps) {
  const itemCount = watchlist.items?.length ?? 0;

  return (
    <WatchlistDetailsDialog
      watchlist={watchlist}
      isOwnProfile={isOwnProfile}
      onRefresh={onRefresh}
      trigger={
        <button
          type="button"
          className="flex h-full min-h-44 flex-col rounded-2xl border bg-card p-4 text-left transition hover:bg-muted/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">
                {watchlist.name}
              </h3>
            </div>

            <Badge variant="outline" className="shrink-0 gap-1 rounded-full">
              {getVisibilityIcon(watchlist.visibility)}
              {watchlist.visibility}
            </Badge>
          </div>

          <div className="mt-3 min-h-9">
            {watchlist.description ? (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {watchlist.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground opacity-0">
                placeholder
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 space-y-3">
            {watchlist.items?.length ? (
              <TickerAvatarGroup tickers={watchlist.items} />
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full">
                {itemCount} items
              </Badge>

              {watchlist.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="rounded-full">
                  {tag.name}
                </Badge>
              ))}

              {(watchlist.tags?.length ?? 0) > 3 ? (
                <Badge variant="outline" className="rounded-full">
                  +{(watchlist.tags?.length ?? 0) - 3}
                </Badge>
              ) : null}
            </div>
          </div>
        </button>
      }
    />
  );
}
