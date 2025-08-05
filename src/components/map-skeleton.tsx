import { Skeleton } from "@/components/ui/skeleton";

export default function MapSkeleton() {
  return (
    <div className="h-96 rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <Skeleton className="h-full w-full rounded-md" />
    </div>
  );
}