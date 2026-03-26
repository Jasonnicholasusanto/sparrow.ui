import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingTraderPage() {
  return (
    <Card className="w-full bg-card p-0 pb-12 rounded-xl">
      <div className="mb-13 relative">
        <div className="relative h-50 w-full rounded-t-xl overflow-hidden">
          <Skeleton className="h-full w-full rounded-t-xl rounded-b-xs" />
        </div>
      </div>

      <div className="px-8 mt-10 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex gap-4 mt-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-12 w-full mt-6" />
      </div>
    </Card>
  );
}
