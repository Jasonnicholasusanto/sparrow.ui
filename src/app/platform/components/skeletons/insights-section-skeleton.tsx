import { Card, CardContent } from "@/components/ui/card";
import { SkeletonBlock } from "./skeleton-block";

export function InsightsSectionSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <SkeletonBlock className="h-9 w-9 rounded-2xl" />

        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-4 w-80" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-3xl">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <SkeletonBlock className="h-9 w-9 rounded-2xl" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
              </div>

              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-44" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-9/12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
