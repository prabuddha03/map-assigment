import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Thermometer, Wifi, Zap } from "lucide-react";
import { useTimeSeriesData } from "@/hooks/useTimeSeriesData";

export default function OverallDetails() {
  const { currentDataPoint, loading, isFutureData, isRange } = useTimeSeriesData();

  if (loading || !currentDataPoint) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Network Status & Updates</CardTitle>
          <CardDescription>
            Live metrics from the entire IoT network.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }
  const { networkStatus } = currentDataPoint;

  return (
    <Card className={`h-full ${isFutureData ? 'border-dashed border-2 border-blue-400 bg-blue-50/30 dark:bg-blue-950/10' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Network Status & Updates
              {isFutureData && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md font-medium">
                  {isRange ? 'PREDICTED RANGE' : 'PREDICTED'}
                </span>
              )}
              {isRange && !isFutureData && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md font-medium">
                  RANGE AVERAGE
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {isFutureData 
                ? "Predicted metrics based on historical trends" 
                : isRange 
                ? "Averaged metrics across selected time range"
                : "Live metrics from the entire IoT network"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className={`h-4 w-4 ${networkStatus.uptime > 99 ? 'text-green-500' : 'text-yellow-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStatus.uptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Latency</CardTitle>
            <Wifi className={`h-4 w-4 ${networkStatus.avgLatency < 120 ? 'text-green-500' : 'text-yellow-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStatus.avgLatency}ms</div>
            <p className="text-xs text-muted-foreground">Across all devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy Usage
            </CardTitle>
            <Zap className={`h-4 w-4 ${networkStatus.energyUsage < 900 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStatus.energyUsage} kWh</div>
            <p className="text-xs text-muted-foreground">Current hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Temp
            </CardTitle>
            <Thermometer className={`h-4 w-4 ${networkStatus.avgTemp < 50 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStatus.avgTemp}°C</div>
            <p className="text-xs text-muted-foreground">
              Across all factories
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}