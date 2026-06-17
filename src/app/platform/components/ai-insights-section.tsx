import { AlertTriangle, Brain, Sparkles, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardSectionHeading } from "./dashboard-section-heading";
import { AiInsight } from "@/schemas/dashboardTypes";

type AiInsightsSectionProps = {
  insights: AiInsight[];
};

function getInsightToneClass(tone: AiInsight["tone"]) {
  if (tone === "positive") {
    return "border-emerald-500/20 bg-emerald-500/5";
  }

  if (tone === "negative") {
    return "border-rose-500/20 bg-rose-500/5";
  }

  return "border-border bg-muted/30";
}

function getInsightIcon(tone: AiInsight["tone"]) {
  if (tone === "positive") {
    return <TrendingUp className="h-4 w-4" />;
  }

  if (tone === "negative") {
    return <AlertTriangle className="h-4 w-4" />;
  }

  return <Sparkles className="h-4 w-4" />;
}

export function AiInsightsSection({ insights }: AiInsightsSectionProps) {
  return (
    <section>
      <DashboardSectionHeading
        icon={<Brain className="h-4 w-4" />}
        title="AI Watchlist Insights"
        description="Short, high-signal interpretations to help you focus on what matters."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            className={`rounded-3xl border ${getInsightToneClass(
              insight.tone,
            )}`}
          >
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="rounded-2xl border bg-background p-2 text-muted-foreground">
                  {getInsightIcon(insight.tone)}
                </div>

                <Badge variant="outline" className="rounded-full capitalize">
                  {insight.tone}
                </Badge>
              </div>

              <h3 className="text-base font-semibold">{insight.title}</h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
