import { Skeleton } from "@/components/ui/skeleton";

export default function KpiCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="p-6 pt-0">
        <Skeleton className="h-8 w-[120px] mb-2" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>
  );
}