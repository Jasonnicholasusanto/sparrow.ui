import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonBlock } from "./skeleton-block";

export function DashboardHeroSkeleton() {
  return (
    <section className="space-y-4">
      <Card className="overflow-hidden rounded-3xl">
        <CardHeader>
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-10 w-72" />
            <SkeletonBlock className="h-5 w-full max-w-2xl" />
            <SkeletonBlock className="h-5 w-full max-w-xl" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border p-4">
            <div className="mb-3 flex items-center gap-2">
              <SkeletonBlock className="h-8 w-8 rounded-xl" />
              <SkeletonBlock className="h-4 w-40" />
            </div>

            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-9/12" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-3xl">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <SkeletonBlock className="h-9 w-9 rounded-2xl" />
                <SkeletonBlock className="h-6 w-16 rounded-full" />
              </div>

              <SkeletonBlock className="h-3 w-32" />

              <div className="mt-3 space-y-2">
                <SkeletonBlock className="h-6 w-24" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-10/12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
