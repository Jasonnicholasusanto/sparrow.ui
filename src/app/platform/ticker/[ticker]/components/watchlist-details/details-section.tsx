import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DetailsSectionProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export function DetailsSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: DetailsSectionProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-2xl border-border/60 shadow-none",
        className,
      )}
    >
      <CardHeader className="border-b">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="rounded-xl border bg-muted/40 p-2 text-muted-foreground">
              <Icon className="size-4" />
            </div>
          )}

          <div>
            <CardTitle className="text-base">{title}</CardTitle>

            {description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}
