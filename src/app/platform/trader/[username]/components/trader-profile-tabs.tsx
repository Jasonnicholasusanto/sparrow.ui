"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMyWatchlistsClient } from "@/lib/data/client/watchlist";
import type {
  GetMyWatchlistsResponse,
  WatchlistDetailOut,
} from "@/schemas/watchlist";
import { WatchlistsTab } from "./watchlists-tab";

type TraderProfileTabsProps = {
  isOwnProfile: boolean;
};

type WatchlistVisibilityFilter = "public" | "shared" | "private";

export function TraderProfileTabs({ isOwnProfile }: TraderProfileTabsProps) {
  const [watchlistVisibility, setWatchlistVisibility] =
    useState<WatchlistVisibilityFilter>("public");
  const [loading, setLoading] = useState(false);
  const [watchlistsResponse, setWatchlistsResponse] =
    useState<GetMyWatchlistsResponse | null>(null);

  const visibilityOptions = useMemo(() => {
    if (isOwnProfile) {
      return [
        { label: "Public", value: "public" },
        { label: "Shared", value: "shared" },
        { label: "Private", value: "private" },
      ] as const;
    }

    return [{ label: "Public", value: "public" }] as const;
  }, [isOwnProfile]);

  const tabs = [
    { label: "Watchlists", active: true, disabled: false },
    { label: "Posts", active: false, disabled: true },
    { label: "Activity", active: false, disabled: true },
  ] as const;

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
    void loadWatchlists();
  }, []);

  const allWatchlists = useMemo(() => {
    const grouped = watchlistsResponse?.results;
    if (!grouped) return [];

    const merged = [
      ...(grouped.created ?? []),
      ...(grouped.forked ?? []),
      ...(grouped.shared ?? []),
      ...(grouped.bookmarked ?? []),
    ];

    return Array.from(
      new Map(merged.map((watchlist) => [watchlist.id, watchlist])).values(),
    ) as WatchlistDetailOut[];
  }, [watchlistsResponse]);

  const filteredWatchlists = useMemo(() => {
    return allWatchlists.filter(
      (watchlist) => watchlist.visibility === watchlistVisibility,
    );
  }, [allWatchlists, watchlistVisibility]);

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              disabled={tab.disabled}
              className={cn(
                "rounded-xl px-4 py-2 text-sm transition-colors",
                tab.active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
                tab.disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-55">
          <Select
            value={watchlistVisibility}
            onValueChange={(value) =>
              setWatchlistVisibility(value as WatchlistVisibilityFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter watchlists" />
            </SelectTrigger>

            <SelectContent>
              {visibilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="px-1 pt-3 text-xs text-muted-foreground">
        {isOwnProfile
          ? "Filter your watchlists by Public, Shared, or Private. Posts and Activity are coming later."
          : "You can currently view public watchlists here. Posts and Activity are coming later."}
      </p>

      <div className="pt-5">
        <WatchlistsTab
          watchlists={filteredWatchlists}
          loading={loading}
          isOwnProfile={isOwnProfile}
          onRefresh={loadWatchlists}
        />
      </div>
    </section>
  );
}
