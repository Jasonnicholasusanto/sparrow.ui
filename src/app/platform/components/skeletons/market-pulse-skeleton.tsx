import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonBlock } from "./skeleton-block";

export function MarketPulseSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <SkeletonBlock className="h-9 w-9 rounded-2xl" />

        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-4 w-96 max-w-full" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, cardIndex) => (
          <Card key={cardIndex} className="rounded-3xl">
            <CardHeader className="pb-3">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-4 w-72" />
            </CardHeader>

            <CardContent className="space-y-1 p-3 pt-0">
              {Array.from({ length: 3 }).map((_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between rounded-2xl px-3 py-3"
                >
                  <div className="space-y-2">
                    <SkeletonBlock className="h-5 w-16" />
                    <SkeletonBlock className="h-4 w-32" />
                  </div>

                  <div className="space-y-2">
                    <SkeletonBlock className="ml-auto h-5 w-20" />
                    <SkeletonBlock className="ml-auto h-4 w-14" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
