"use client";

import React, { useState, useEffect } from "react";
import AlertTable from "./alert-table";
import { SidebarMetricsSkeleton, AlertTableSkeleton } from "./sidebar-skeleton";
import { useTimeSeriesData } from "@/hooks/useTimeSeriesData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package2, TrendingUp, TrendingDown, DollarSign, Users, PieChart, BarChart3, Map } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const { currentDataPoint, loading, isFutureData, isRange } = useTimeSeriesData();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for metrics
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isLoading = loading || isInitialLoading;
  return (
    <div className="flex h-full max-h-screen flex-col gap-4">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">Industrial IoT</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {/* Navigation Links */}
          <div className="mb-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <Map className="h-4 w-4" />
              Map Project
            </Link>
          </div>
          {isLoading || !currentDataPoint ? (
            <SidebarMetricsSkeleton />
          ) : (
            <div className="space-y-3">
              {/* Financial Metrics */}
              <Card className={`${isFutureData ? 'border-dashed border-2 border-blue-400 bg-blue-50/30 dark:bg-blue-950/10' : ''}`}>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financial Overview
                    {isFutureData && (
                      <span className="px-1 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded font-medium">
                        {isRange ? 'PRED RANGE' : 'PREDICTED'}
                      </span>
                    )}
                    {isRange && !isFutureData && (
                      <span className="px-1 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded font-medium">
                        RANGE AVG
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Revenue (YTD)</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm">${currentDataPoint.financialMetrics.revenueYTD.toFixed(1)}M</span>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Monthly Revenue</span>
                    <span className="font-semibold text-sm">${currentDataPoint.financialMetrics.monthlyRevenue.toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Profit Growth</span>
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold text-sm ${currentDataPoint.financialMetrics.profitGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {currentDataPoint.financialMetrics.profitGrowth > 0 ? '+' : ''}{currentDataPoint.financialMetrics.profitGrowth.toFixed(1)}%
                      </span>
                      {currentDataPoint.financialMetrics.profitGrowth > 0 ? 
                        <TrendingUp className="h-3 w-3 text-green-500" /> : 
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operations Metrics */}
              <Card className={`${isFutureData ? 'border-dashed border-2 border-blue-400 bg-blue-50/30 dark:bg-blue-950/10' : ''}`}>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Operations
                    {isFutureData && (
                      <span className="px-1 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded font-medium">
                        {isRange ? 'PRED RANGE' : 'PREDICTED'}
                      </span>
                    )}
                    {isRange && !isFutureData && (
                      <span className="px-1 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded font-medium">
                        RANGE AVG
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Active Factories</span>
                    <span className={`font-semibold text-sm ${currentDataPoint.operationalMetrics.activeFactories === 4 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {currentDataPoint.operationalMetrics.activeFactories}/4
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Total Workers</span>
                    <span className="font-semibold text-sm">{currentDataPoint.operationalMetrics.totalWorkers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Efficiency Rate</span>
                    <span className={`font-semibold text-sm ${currentDataPoint.operationalMetrics.efficiencyRate > 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {currentDataPoint.operationalMetrics.efficiencyRate.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Shareholding Pattern */}
              <Card className={`${isFutureData ? 'border-dashed border-2 border-blue-400 bg-blue-50/30 dark:bg-blue-950/10' : ''}`}>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Shareholding
                    {isFutureData && (
                      <span className="px-1 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded font-medium">
                        {isRange ? 'PRED RANGE' : 'PREDICTED'}
                      </span>
                    )}
                    {isRange && !isFutureData && (
                      <span className="px-1 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded font-medium">
                        RANGE AVG
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Institutional</span>
                    <span className="font-semibold text-sm">{currentDataPoint.shareholding.institutional.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Retail</span>
                    <span className="font-semibold text-sm">{currentDataPoint.shareholding.retail.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Promoter</span>
                    <span className="font-semibold text-sm">{currentDataPoint.shareholding.promoter.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <h3 className="font-semibold mb-2 text-lg">Recent Alerts</h3>
        {isLoading ? <AlertTableSkeleton /> : <AlertTable />}
      </div>
    </div>
  );
}