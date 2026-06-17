import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

export type MetricItem = {
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
};

type MetricGridProps = {
  items: MetricItem[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 xl:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

function isUrl(value: React.ReactNode): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function renderMetricValue(value: React.ReactNode) {
  if (!isUrl(value)) {
    return value;
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-1.5 text-primary underline-offset-4 transition-colors hover:underline"
    >
      <span className="truncate">{value}</span>
      <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}

export function MetricGrid({ items, columns = 3, className }: MetricGridProps) {
  const visibleItems = items.filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined &&
      item.value !== "" &&
      item.value !== "—",
  );

  if (!visibleItems.length) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No information is currently available.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-8 gap-y-5",
        columnClasses[columns],
        className,
      )}
    >
      {visibleItems.map((item) => (
        <div key={item.label} className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {item.label}
          </p>

          <div className="mt-1 wrap-break-words text-sm font-semibold">
            {renderMetricValue(item.value)}
          </div>

          {item.description && (
            <div className="mt-0.5 text-xs text-muted-foreground">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
