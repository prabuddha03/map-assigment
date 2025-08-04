"use client";

import dynamic from "next/dynamic";
import KpiCard from "@/components/kpi-card";
import {
  DollarSign,
  Package,
  AlertTriangle,
  Cpu,
  LucideProps,
} from "lucide-react";
import { Suspense, useMemo, useState, useEffect } from "react";
import SliderControl from "@/components/slider-control";
import PlaybackControls from "@/components/playback-controls";
import KpiCardSkeleton from "@/components/kpi-card-skeleton";
import MapSkeleton from "@/components/map-skeleton";
import ChartSkeleton from "@/components/chart-skeleton";
import OverallDetails from "@/components/overall-details";
import FactoryAnalytics from "@/components/factory-analytics";
import ThemeToggle from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CombinedProductionChart from "@/components/combined-production-chart";
import MachineHealthChart from "@/components/machine-health-chart";
import EnvironmentalHeatmap from "@/components/environmental-heatmap";
import EfficiencyGauge from "@/components/efficiency-gauge";
import SalesBarChart from "@/components/sales-bar-chart";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { format } from "date-fns";
import { useTimeSeriesData } from "@/hooks/useTimeSeriesData";

interface KpiData {
  id: number;
  title: string;
  value: string;
  trend: string;
  status: "connected" | "disconnected";
  lastUpdated: string;
  statusReason: string;
}

interface TimeSeriesData {
  timestamp: string;
  factories: Array<{
    id: number;
    name: string;
    production: number;
    status: string;
    energy: number;
  }>;
  kpis: {
    totalUnits: number;
    defectRate: number;
    energyUse: number;
    alerts: number;
  };
}

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  "Total Units": Package,
  "Avg Defect Rate": AlertTriangle,
  "Total Energy Use": Cpu,
  "Total Alerts": DollarSign,
};

export default function DashboardPage() {
  const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
  const { currentDataPoint, loading: timeSeriesLoading, isFutureData, isRange } = useTimeSeriesData();
  
  // Get the selected date from Redux store
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);

  // Generate dynamic KPI data based on current data point
  const kpiData: KpiData[] = useMemo(() => {
    if (!currentDataPoint) return [];

    const trendSuffix = isFutureData ? " (predicted)" : isRange ? " (range avg)" : "";

    return [
      {
        id: 1,
        title: "Total Units",
        value: currentDataPoint.kpis.totalUnits.toLocaleString(),
        trend: (currentDataPoint.kpis.totalUnits > 1200000 ? "+15% from last month" : "+8% from last month") + trendSuffix,
        status: "connected" as const,
        lastUpdated: currentDataPoint.timestamp,
        statusReason: isFutureData ? "Predicted based on trends" : "Nominal"
      },
      {
        id: 2,
        title: "Avg Defect Rate",
        value: `${currentDataPoint.kpis.defectRate.toFixed(1)}%`,
        trend: (currentDataPoint.kpis.defectRate < 1.0 ? "-0.3% from last month" : "+0.2% from last month") + trendSuffix,
        status: currentDataPoint.kpis.defectRate > 1.2 ? "disconnected" as const : "connected" as const,
        lastUpdated: currentDataPoint.timestamp,
        statusReason: currentDataPoint.kpis.defectRate > 1.2 
          ? isFutureData ? "Predicted high defect rate" : "High defect rate detected" 
          : isFutureData ? "Predicted optimal rate" : "Nominal"
      },
      {
        id: 3,
        title: "Total Energy Use",
        value: `${currentDataPoint.kpis.energyUse} MWh`,
        trend: (currentDataPoint.kpis.energyUse > 200 ? "+8% from last month" : "+3% from last month") + trendSuffix,
        status: currentDataPoint.kpis.energyUse > 220 ? "disconnected" as const : "connected" as const,
        lastUpdated: currentDataPoint.timestamp,
        statusReason: currentDataPoint.kpis.energyUse > 220 
          ? isFutureData ? "Predicted high consumption" : "High consumption detected"
          : isFutureData ? "Predicted normal usage" : "Nominal"
      },
      {
        id: 4,
        title: "Total Alerts",
        value: currentDataPoint.kpis.alerts.toString(),
        trend: (currentDataPoint.kpis.alerts > 15 ? "+7 since last hour" : "-3 since last hour") + trendSuffix,
        status: currentDataPoint.kpis.alerts > 20 ? "disconnected" as const : "connected" as const,
        lastUpdated: currentDataPoint.timestamp,
        statusReason: currentDataPoint.kpis.alerts > 20 
          ? isFutureData ? "Predicted high alert volume" : "High alert volume"
          : isFutureData ? "Predicted low alerts" : "Nominal"
      }
    ];
  }, [currentDataPoint, isFutureData, isRange]);

  const FactoryMap = useMemo(
    () =>
      dynamic(() => import("@/components/factory-map"), {
        loading: () => <MapSkeleton />,
        ssr: false,
      }),
    []
  );

  const UserbaseSplitMap = useMemo(
    () =>
      dynamic(() => import("@/components/userbase-split-map"), {
        loading: () => <MapSkeleton />,
        ssr: false,
      }),
    []
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <span className="font-semibold">Factory Count:</span> {currentDataPoint?.operationalMetrics.activeFactories || 4}
            <span className="font-semibold">Revenue:</span> ${currentDataPoint?.financialMetrics.monthlyRevenue.toFixed(1) || '1.2'}M
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col gap-8 w-full p-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SliderControl />
            </div>
            <PlaybackControls />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {timeSeriesLoading || kpiData.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <KpiCardSkeleton key={i} />
                ))
              : kpiData.map((data) => {
                  const Icon = iconMap[data.title];
                  return (
                    <KpiCard
                      key={data.id}
                      title={data.title}
                      value={data.value}
                      icon={<Icon className="h-4 w-4 text-muted-foreground" />}
                      trend={data.trend}
                      status={data.status}
                      lastUpdated={data.lastUpdated}
                      statusReason={data.statusReason}
                      isLoading={timeSeriesLoading}
                      isFuture={isFutureData}
                      isRange={isRange}
                    />
                  );
                })}
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
            <div
              className={`lg:col-span-3 transition-all duration-300 ${
                selectedFactory ? "lg:col-span-2" : ""
              }`}
            >
              <Suspense fallback={<MapSkeleton />}>
                <div className="h-96 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <FactoryMap onSelectFactory={setSelectedFactory} />
                </div>
              </Suspense>
            </div>
            <div
              className={`lg:col-span-2 transition-all duration-300 ${
                selectedFactory ? "lg:col-span-3" : ""
              }`}
            >
              {selectedFactory ? (
                <FactoryAnalytics
                  factoryId={selectedFactory}
                  onBack={() => setSelectedFactory(null)}
                />
              ) : (
                <OverallDetails />
              )}
            </div>
          </div>

          <Tabs defaultValue="production">
            <TabsList>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="health">Machine Health</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>
            <TabsContent value="production">
              <CombinedProductionChart />
            </TabsContent>
            <TabsContent value="health">
              <MachineHealthChart />
            </TabsContent>
            <TabsContent value="environment">
              <EnvironmentalHeatmap />
            </TabsContent>
            <TabsContent value="efficiency">
              <EfficiencyGauge />
            </TabsContent>
            <TabsContent value="sales">
              <SalesBarChart />
            </TabsContent>
          </Tabs>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <Suspense fallback={<ChartSkeleton />}>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  Combined Production
                </h2>
                <CombinedProductionChart />
              </Suspense>
            </div>
            <div className="lg:col-span-3">
              <Suspense fallback={<MapSkeleton />}>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  Userbase Split
                </h2>
                <div className="h-96 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <UserbaseSplitMap />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}