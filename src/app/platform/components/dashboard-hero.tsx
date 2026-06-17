import { format } from "date-fns";
import { Sparkles } from "lucide-react";

import BorderGlow from "@/components/border-glow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DashboardStat } from "@/schemas/dashboardTypes";
import { DashboardStatCard } from "./dashboard-stat-card";

type DashboardHeroProps = {
  userName: string;
  stats: DashboardStat[];
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

export function DashboardHero({ userName, stats }: DashboardHeroProps) {
  const greeting = getGreeting();
  const today = format(new Date(), "EEEE, d MMMM yyyy");

  return (
    <section className="space-y-4">
      <Card className="overflow-hidden rounded-3xl">
        <CardHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{today}</p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {greeting}, {userName}
            </h1>

            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Here is what is moving across your watchlists, the broader market,
              and the stories most likely to affect your investing ideas today.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#060010"
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={["#c084fc", "#f472b6", "#38bdf8"]}
          >
            <div className="rounded-2xl p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">AI Market Sentiment</span>
              </div>

              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                Your watchlists are leaning cautiously bullish today. AI and
                semiconductor exposure is leading performance, while higher
                volatility remains concentrated in growth names. News sentiment
                is strongest for infrastructure-related technology stocks, but
                macro commentary may still drive short-term pullbacks.
              </p>
            </div>
          </BorderGlow>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  );
}
