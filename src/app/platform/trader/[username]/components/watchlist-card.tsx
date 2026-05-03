"use client";

import { useMemo, useState } from "react";
import { Globe, Lock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { WatchlistDetailOut } from "@/schemas/watchlist";
import { WatchlistDetailsDialog } from "./watchlist-details-dialog";

type WatchlistCardProps = {
  watchlist: WatchlistDetailOut;
  isOwnProfile: boolean;
  onRefresh: () => void | Promise<void>;
};

function getVisibilityIcon(visibility: string) {
  const normalized = visibility.toLowerCase();

  if (normalized === "private") return <Lock className="h-3.5 w-3.5" />;
  if (normalized === "shared") return <Users className="h-3.5 w-3.5" />;
  return <Globe className="h-3.5 w-3.5" />;
}

export function WatchlistCard({
  watchlist,
  isOwnProfile,
  onRefresh,
}: WatchlistCardProps) {
  const [open, setOpen] = useState(false);

  const itemCount = useMemo(
    () => watchlist.items?.length ?? 0,
    [watchlist.items],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-2xl border bg-card p-4 text-left transition hover:bg-muted/40"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">
              {watchlist.name}
            </h3>
            {watchlist.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {watchlist.description}
              </p>
            ) : null}
          </div>

          <Badge variant="outline" className="gap-1 rounded-full shrink-0">
            {getVisibilityIcon(watchlist.visibility)}
            {watchlist.visibility}
          </Badge>
        </div>

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
      </button>

      <WatchlistDetailsDialog
        open={open}
        onOpenChange={setOpen}
        watchlist={watchlist}
        isOwnProfile={isOwnProfile}
        onRefresh={onRefresh}
      />
    </>
  );
}
