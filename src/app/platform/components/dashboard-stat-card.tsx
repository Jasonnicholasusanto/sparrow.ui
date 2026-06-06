import type { DashboardStat } from "@/schemas/dashboardTypes";
import { ChangePill } from "./change-pill";
import { Card, CardContent } from "@/components/ui/card";

type DashboardStatCardProps = {
  stat: DashboardStat;
};

export function DashboardStatCard({ stat }: DashboardStatCardProps) {
  const Icon = stat.icon;
  const isPositive = stat.change >= 0;

  return (
    <Card className="group rounded-3xl bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
              <Icon className="h-4 w-4" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {stat.label}
            </p>
          </div>

          <ChangePill value={stat.change} size="sm" />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="truncate text-2xl font-semibold tracking-tight">
              {stat.title}
            </h3>

            <p
              className={`shrink-0 text-sm font-semibold ${
                isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {stat.value}
            </p>
          </div>

          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {stat.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
