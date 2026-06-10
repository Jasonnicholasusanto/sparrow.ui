import { cn } from "@/lib/utils";
import {
  formatCurrency,
  getPricePosition,
  hasNumber,
} from "@/lib/utils/stockDetails";

type PriceRangeIndicatorProps = {
  label: string;
  low: number | null | undefined;
  high: number | null | undefined;
  currentPrice: number | null | undefined;
  currency?: string;
  className?: string;
};

export function PriceRangeIndicator({
  label,
  low,
  high,
  currentPrice,
  currency = "USD",
  className,
}: PriceRangeIndicatorProps) {
  const position = getPricePosition(currentPrice, low, high);

  if (
    !hasNumber(low) ||
    !hasNumber(high) ||
    !hasNumber(currentPrice) ||
    position === null
  ) {
    return null;
  }

  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-semibold">
        {formatCurrency(low, currency)} – {formatCurrency(high, currency)}
      </p>

      <div className="mt-3">
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-sm"
            style={{
              left: `${position}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Low</span>

        <span>{position.toFixed(0)}% through range</span>

        <span>High</span>
      </div>
    </div>
  );
}
