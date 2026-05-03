"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { WatchlistDetailOut } from "@/schemas/watchlist";
import { WatchlistCard } from "./watchlist-card";

type WatchlistsTabProps = {
  watchlists: WatchlistDetailOut[];
  loading: boolean;
  isOwnProfile: boolean;
  onRefresh: () => void | Promise<void>;
};

export function WatchlistsTab({
  watchlists,
  loading,
  isOwnProfile,
  onRefresh,
}: WatchlistsTabProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border p-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!watchlists.length) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
        No watchlists found for this filter.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {watchlists.map((watchlist) => (
        <WatchlistCard
          key={watchlist.id}
          watchlist={watchlist}
          isOwnProfile={isOwnProfile}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
