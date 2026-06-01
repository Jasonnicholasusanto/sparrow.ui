import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonBlock } from "./skeleton-block";

export function NewsSectionSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <SkeletonBlock className="h-9 w-9 rounded-2xl" />

        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-56" />
          <SkeletonBlock className="h-4 w-96 max-w-full" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-3xl">
            <CardHeader className="space-y-3 pb-3">
              <div className="flex items-center justify-between gap-3">
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-4 w-12" />
              </div>

              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-5 w-10/12" />

              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-8/12" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <SkeletonBlock className="mb-2 h-3 w-28" />

                <div className="flex flex-wrap gap-2">
                  <SkeletonBlock className="h-6 w-14 rounded-full" />
                  <SkeletonBlock className="h-6 w-14 rounded-full" />
                  <SkeletonBlock className="h-6 w-14 rounded-full" />
                </div>
              </div>

              <div>
                <SkeletonBlock className="mb-2 h-3 w-36" />

                <div className="flex flex-wrap gap-2">
                  <SkeletonBlock className="h-6 w-24 rounded-full" />
                  <SkeletonBlock className="h-6 w-28 rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <SkeletonBlock className="h-6 w-20 rounded-full" />
                  <SkeletonBlock className="h-6 w-24 rounded-full" />
                </div>

                <SkeletonBlock className="h-8 w-16 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
