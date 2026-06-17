import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  trend?: "positive" | "negative" | "neutral";
  className?: string;
};

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  trend = "neutral",
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-2xl border-border/60 shadow-none",
        className,
      )}
    >
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>

          {Icon && (
            <div className="rounded-lg border bg-muted/40 p-1.5 text-muted-foreground">
              <Icon className="size-3.5" />
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-1 text-lg font-semibold tracking-tight",
            trend === "positive" && "text-emerald-600 dark:text-emerald-400",
            trend === "negative" && "text-red-600 dark:text-red-400",
          )}
        >
          {value}
        </div>

        {description && (
          <div className="mt-1 text-xs text-muted-foreground">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
