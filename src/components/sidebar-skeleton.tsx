import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function SidebarMetricsSkeleton() {
  return (
    <div className="space-y-3">
      {/* Financial Overview Skeleton */}
      <Card>
        <CardHeader className="p-3 pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-18" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operations Skeleton */}
      <Card>
        <CardHeader className="p-3 pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-18" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </CardContent>
      </Card>

      {/* Shareholding Skeleton */}
      <Card>
        <CardHeader className="p-3 pb-2">
          <Skeleton className="h-5 w-26" />
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AlertTableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded border">
          <Skeleton className="h-5 w-12 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}