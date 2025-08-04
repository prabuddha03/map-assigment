import { Skeleton } from "@/components/ui/skeleton";

export default function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-[200px]" />
      <div className="space-y-2">
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
}