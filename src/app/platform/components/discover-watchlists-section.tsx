import { Compass } from "lucide-react";

import { DashboardSectionHeading } from "./dashboard-section-heading";
import type { WatchlistSummary } from "@/schemas/dashboardTypes";
import { WatchlistSummaryCard } from "./watchlist-summary-card";

type DiscoverWatchlistsSectionProps = {
  watchlists: WatchlistSummary[];
};

export function DiscoverWatchlistsSection({
  watchlists,
}: DiscoverWatchlistsSectionProps) {
  return (
    <section>
      <DashboardSectionHeading
        icon={<Compass className="h-4 w-4" />}
        title="Discover Trending Watchlists"
        description="Popular public watchlists being forked, bookmarked, and followed by the Sparrow community."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {watchlists.map((watchlist) => (
          <WatchlistSummaryCard
            key={watchlist.id}
            watchlist={watchlist}
            href={`/discover/watchlists/${watchlist.id}`}
            ctaLabel="View public watchlist"
          />
        ))}
      </div>
    </section>
  );
}
