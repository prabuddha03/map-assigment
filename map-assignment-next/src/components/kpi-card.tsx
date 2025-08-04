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
  isFuture?: boolean;
  isRange?: boolean;
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
  isFuture = false,
  isRange = false,
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
          <Card className={`
            transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg
            ${isFuture ? 'border-dashed border-2 border-blue-400 bg-blue-50/50 dark:bg-blue-950/20' : ''}
          `}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {isFuture && (
                  <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md font-medium">
                    {isRange ? 'PREDICTED RANGE' : 'PREDICTED'}
                  </span>
                )}
                {isRange && !isFuture && (
                  <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md font-medium">
                    RANGE AVG
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    status === "connected" 
                      ? isFuture 
                        ? "bg-blue-500 animate-pulse" 
                        : "bg-green-500 animate-pulse" 
                      : "bg-red-500"
                  }`}
                />
                {icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isFuture ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                {value}
              </div>
              <p className={`text-xs ${isFuture ? 'text-blue-500 dark:text-blue-400' : 'text-muted-foreground'}`}>
                {trend}
              </p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">
            Status: {status === "connected" ? "Connected" : "Disconnected"}
            {isFuture && " (Predicted)"}
          </p>
          <p className="text-xs text-muted-foreground">Reason: {statusReason}</p>
          <p className="text-xs text-muted-foreground">
            {isRange ? "Range End: " : "Hour: "}{new Date(lastUpdated).toLocaleString('en-US', { 
              month: 'short', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
          {isFuture && (
            <p className="text-xs text-blue-500 font-medium mt-1">
              📊 This data is predicted based on historical trends
            </p>
          )}
          {isRange && (
            <p className="text-xs text-green-500 font-medium mt-1">
              📈 Averaged across selected time range
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}