import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  status: "connected" | "disconnected";
  lastUpdated: string;
  statusReason: string;
  isLoading?: boolean;
}

export default function KpiCard({
  title,
  value,
  icon,
  trend,
  status,
  lastUpdated,
  statusReason,
  isLoading = false,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    status === "connected" ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                {icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{trend}</p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">Status: {status === "connected" ? "Connected" : "Disconnected"}</p>
          <p className="text-xs text-muted-foreground">Reason: {statusReason}</p>
          <p className="text-xs text-muted-foreground">
            Last Updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}