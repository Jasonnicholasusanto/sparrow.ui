import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonBlock } from "./skeleton-block";

export function WatchlistsSectionSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <SkeletonBlock className="h-9 w-9 rounded-2xl" />

        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-44" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-3xl">
            <CardHeader className="pb-3">
              <div className="mb-3 flex items-center gap-2">
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="w-full space-y-2">
                  <SkeletonBlock className="h-5 w-36" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-9/12" />
                </div>

                <SkeletonBlock className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 p-3">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-5 w-24" />
                </div>

                <div className="space-y-2">
                  <SkeletonBlock className="ml-auto h-4 w-24" />
                  <SkeletonBlock className="ml-auto h-5 w-16" />
                </div>
              </div>

              <SkeletonBlock className="h-9 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
