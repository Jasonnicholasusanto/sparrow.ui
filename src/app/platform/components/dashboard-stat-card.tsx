import type { DashboardStat } from "@/schemas/dashboardTypes";
import { ChangePill } from "./change-pill";
import { Card, CardContent } from "@/components/ui/card";

type DashboardStatCardProps = {
  stat: DashboardStat;
};

export function DashboardStatCard({ stat }: DashboardStatCardProps) {
  const Icon = stat.icon;

  return (
    <Card className="rounded-3xl">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="rounded-2xl border bg-background p-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>

          <ChangePill value={stat.change} size="sm" />
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {stat.label}
        </p>

        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {stat.title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {stat.description}
            </p>
          </div>

          <p
            className={`text-sm font-semibold ${
              stat.change >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {stat.value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
