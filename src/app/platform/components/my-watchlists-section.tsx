import { Briefcase } from "lucide-react";

import { DashboardSectionHeading } from "./dashboard-section-heading";
import { WatchlistSummaryCard } from "./watchlist-summary-card";
import type { WatchlistSummary } from "@/schemas/dashboardTypes";

type MyWatchlistsSectionProps = {
  watchlists: WatchlistSummary[];
};

export function MyWatchlistsSection({ watchlists }: MyWatchlistsSectionProps) {
  return (
    <section>
      <DashboardSectionHeading
        icon={<Briefcase className="h-4 w-4" />}
        title="My Watchlists"
        description="Quick access to the groups you are tracking most closely."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {watchlists.map((watchlist) => (
          <WatchlistSummaryCard key={watchlist.id} watchlist={watchlist} />
        ))}
      </div>
    </section>
  );
}
