import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export interface TimeSeriesDataPoint {
  timestamp: string;
  kpis: {
    totalUnits: number;
    defectRate: number;
    energyUse: number;
    alerts: number;
  };
  networkStatus: {
    uptime: number;
    avgLatency: number;
    energyUsage: number;
    avgTemp: number;
  };
  financialMetrics: {
    revenueYTD: number;
    monthlyRevenue: number;
    profitGrowth: number;
  };
  operationalMetrics: {
    activeFactories: number;
    totalWorkers: number;
    efficiencyRate: number;
  };
  shareholding: {
    institutional: number;
    retail: number;
    promoter: number;
  };
}

export function useTimeSeriesData() {
  const [data, setData] = useState<TimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);

  // Load time series data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/hourly_time_series.json');
        if (!response.ok) {
          throw new Error('Failed to load time series data');
        }
        const timeSeriesData: TimeSeriesDataPoint[] = await response.json();
        
        // Generate additional data points to cover 30 days (15 past + 15 future)
        const extendedData = generateExtendedTimeSeriesData(timeSeriesData);
        setData(extendedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get current data point based on selected date
  const getCurrentDataPoint = (): TimeSeriesDataPoint | null => {
    if (data.length === 0) return null;

    const targetTime = new Date(selectedDate).getTime();
    
    // Find the closest data point
    let closest = data[0];
    let minDiff = Math.abs(new Date(closest.timestamp).getTime() - targetTime);

    for (const point of data) {
      const diff = Math.abs(new Date(point.timestamp).getTime() - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }

    return closest;
  };

  return {
    data,
    loading,
    error,
    currentDataPoint: getCurrentDataPoint(),
  };
}

// Helper function to generate extended time series data
function generateExtendedTimeSeriesData(baseData: TimeSeriesDataPoint[]): TimeSeriesDataPoint[] {
  if (baseData.length === 0) return [];

  const now = new Date();
  const startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days ago
  const endDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days future

  const extendedData: TimeSeriesDataPoint[] = [];
  const basePoint = baseData[0]; // Use first data point as template

  // Generate hourly data points for 30 days
  for (let date = new Date(startDate); date <= endDate; date.setHours(date.getHours() + 1)) {
    const hourOfDay = date.getHours();
    const dayOffset = Math.floor((date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    // Add some variation based on time of day and day offset
    const timeVariation = Math.sin((hourOfDay / 24) * 2 * Math.PI) * 0.1;
    const dayVariation = (dayOffset / 30) * 0.2;
    const randomVariation = (Math.random() - 0.5) * 0.05;
    const totalVariation = 1 + timeVariation + dayVariation + randomVariation;

    const dataPoint: TimeSeriesDataPoint = {
      timestamp: new Date(date).toISOString(),
      kpis: {
        totalUnits: Math.floor(basePoint.kpis.totalUnits * totalVariation),
        defectRate: Math.max(0.1, basePoint.kpis.defectRate * (1 + randomVariation)),
        energyUse: Math.floor(basePoint.kpis.energyUse * totalVariation),
        alerts: Math.max(0, Math.floor(basePoint.kpis.alerts * (1 + randomVariation * 2))),
      },
      networkStatus: {
        uptime: Math.min(100, Math.max(95, basePoint.networkStatus.uptime + randomVariation * 2)),
        avgLatency: Math.max(50, Math.floor(basePoint.networkStatus.avgLatency * (1 + randomVariation))),
        energyUsage: Math.floor(basePoint.networkStatus.energyUsage * totalVariation),
        avgTemp: Math.floor(basePoint.networkStatus.avgTemp * (1 + randomVariation * 0.2)),
      },
      financialMetrics: {
        revenueYTD: basePoint.financialMetrics.revenueYTD * (1 + dayVariation),
        monthlyRevenue: basePoint.financialMetrics.monthlyRevenue * totalVariation,
        profitGrowth: basePoint.financialMetrics.profitGrowth * (1 + randomVariation * 0.5),
      },
      operationalMetrics: {
        activeFactories: Math.min(4, Math.max(3, basePoint.operationalMetrics.activeFactories + Math.floor(randomVariation * 2))),
        totalWorkers: Math.floor(basePoint.operationalMetrics.totalWorkers * (1 + randomVariation * 0.1)),
        efficiencyRate: Math.min(100, Math.max(85, basePoint.operationalMetrics.efficiencyRate * (1 + randomVariation * 0.1))),
      },
      shareholding: {
        institutional: Math.min(75, Math.max(65, basePoint.shareholding.institutional + randomVariation * 5)),
        retail: Math.min(30, Math.max(20, basePoint.shareholding.retail + randomVariation * 3)),
        promoter: basePoint.shareholding.promoter, // Keep promoter share stable
      },
    };

    extendedData.push(dataPoint);
  }

  return extendedData;
}