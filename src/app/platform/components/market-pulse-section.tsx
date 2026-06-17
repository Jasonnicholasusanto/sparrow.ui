import { Globe } from "lucide-react";

import type { MarketPulse } from "@/schemas/dashboardTypes";
import { DashboardSectionHeading } from "./dashboard-section-heading";
import { MarketListCard, PerformanceListCard } from "./market-list-card";

type MarketPulseSectionProps = {
  marketPulse: MarketPulse;
};

export function MarketPulseSection({ marketPulse }: MarketPulseSectionProps) {
  return (
    <section>
      <DashboardSectionHeading
        icon={<Globe className="h-4 w-4" />}
        title="Market Pulse"
        description="Broader market context, trending stocks, and sector performance."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <MarketListCard
          title="Major Indices"
          description="Broad market summary across major indices."
          items={marketPulse.indices}
        />

        <MarketListCard
          title="Highest Volume"
          description="Stocks attracting the most trading activity."
          items={marketPulse.highestVolume}
        />

        <MarketListCard
          title="Most Volatile"
          description="Names with larger short-term movement."
          items={marketPulse.mostVolatile}
        />

        <MarketListCard
          title="Top Gainers"
          description="Strongest positive movers today."
          items={marketPulse.gainers}
        />

        <MarketListCard
          title="Top Losers"
          description="Weakest movers today."
          items={marketPulse.losers}
        />

        <PerformanceListCard
          title="Sector Performance"
          description="High-level performance by market sector."
          items={marketPulse.sectorPerformance}
        />

        <PerformanceListCard
          title="Industry Performance"
          description="More granular performance by industry group."
          items={marketPulse.industryPerformance}
        />
      </div>
    </section>
  );
}
