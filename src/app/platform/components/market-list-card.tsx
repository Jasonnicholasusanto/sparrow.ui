import type { MarketItem, PerformanceItem } from "@/schemas/dashboardTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MarketListCardProps = {
  title: string;
  description?: string;
  items: MarketItem[];
};

type PerformanceListCardProps = {
  title: string;
  description?: string;
  items: PerformanceItem[];
};

export function MarketListCard({
  title,
  description,
  items,
}: MarketListCardProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>

        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between rounded-2xl px-3 py-3 hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="font-medium">{item.symbol}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {item.name}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">{item.price}</p>
                <p
                  className={`text-sm ${
                    item.change >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </p>

                {item.volume ? (
                  <p className="text-xs text-muted-foreground">
                    Vol {item.volume}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceListCard({
  title,
  description,
  items,
}: PerformanceListCardProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>

        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl px-3 py-3 hover:bg-muted/40"
            >
              <p className="font-medium">{item.name}</p>

              <p
                className={`text-sm font-medium ${
                  item.change >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
