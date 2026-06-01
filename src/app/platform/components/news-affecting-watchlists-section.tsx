import { ChevronRight, Newspaper } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardSectionHeading } from "./dashboard-section-heading";
import { NewsItem } from "@/schemas/dashboardTypes";

type NewsAffectingWatchlistsSectionProps = {
  newsItems: NewsItem[];
};

function getSentimentBadgeClass(sentiment: NewsItem["sentiment"]) {
  if (sentiment === "Bullish") {
    return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10";
  }

  if (sentiment === "Bearish") {
    return "bg-rose-500/10 text-rose-600 hover:bg-rose-500/10";
  }

  return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/10";
}

function getImpactBadgeClass(impact: NewsItem["impact"]) {
  if (impact === "High") {
    return "bg-orange-500/10 text-orange-600 hover:bg-orange-500/10";
  }

  if (impact === "Medium") {
    return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10";
  }

  return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/10";
}

export function NewsAffectingWatchlistsSection({
  newsItems,
}: NewsAffectingWatchlistsSectionProps) {
  return (
    <section>
      <DashboardSectionHeading
        icon={<Newspaper className="h-4 w-4" />}
        title="News Affecting Watchlists"
        description="Headlines mapped to the stocks and watchlists you care about."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {newsItems.map((item) => (
          <Card
            key={item.id}
            className="group rounded-3xl transition-transform hover:-translate-y-0.5"
          >
            <CardHeader className="space-y-3 pb-3">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline" className="rounded-full">
                  {item.category}
                </Badge>

                <span className="text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>

              <CardTitle className="text-base leading-6">
                {item.title}
              </CardTitle>

              <CardDescription className="line-clamp-3">
                {item.summary}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Related tickers
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.relatedTickers.map((ticker) => (
                    <Badge
                      key={ticker}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {ticker}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Affects watchlists
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.relatedWatchlists.map((watchlist) => (
                    <Badge
                      key={watchlist}
                      variant="outline"
                      className="rounded-full"
                    >
                      {watchlist}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={getSentimentBadgeClass(item.sentiment)}
                  >
                    {item.sentiment}
                  </Badge>

                  <Badge
                    variant="secondary"
                    className={getImpactBadgeClass(item.impact)}
                  >
                    {item.impact} impact
                  </Badge>
                </div>

                <Button variant="ghost" size="sm" className="gap-1">
                  Read
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
