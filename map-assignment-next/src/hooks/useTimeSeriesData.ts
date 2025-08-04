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
  const selectedDateRange = useSelector((state: RootState) => state.date.selectedDateRange);
  const isRange = useSelector((state: RootState) => state.date.isRange);

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
    if (!data || data.length === 0) return null;

    if (isRange && selectedDateRange && selectedDateRange.length === 2) {
      // For date range, aggregate data across the range
      try {
        const aggregated = getAggregatedDataPoint(selectedDateRange);
        return aggregated;
      } catch (error) {
        console.error('Error aggregating data points:', error);
        // Fallback to single point logic
        return getSingleDataPoint();
      }
    } else {
      // For single date, find closest point
      return getSingleDataPoint();
    }
  };

  // Helper function to get single data point
  const getSingleDataPoint = (): TimeSeriesDataPoint | null => {
    if (!data || data.length === 0) return null;

    const targetTime = new Date(selectedDate).getTime();
    
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

  // Aggregate data points across a date range
  const getAggregatedDataPoint = (dateRange: [string, string]): TimeSeriesDataPoint => {
    // Safety check for data availability
    if (!data || data.length === 0) {
      return null as any; // This will be handled by the caller
    }

    const [startDate, endDate] = dateRange;
    
    // Safety check for valid date range
    if (!startDate || !endDate) {
      return data[0]; // Return first available data point
    }

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    // If start and end are the same, treat as single point
    if (startTime === endTime) {
      const targetTime = startTime;
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
    }

    // Filter data points within the range
    const rangeData = data.filter(point => {
      const pointTime = new Date(point.timestamp).getTime();
      return pointTime >= startTime && pointTime <= endTime;
    });

    if (rangeData.length === 0) {
      // Return closest single point if no data in range
      const targetTime = new Date(endDate).getTime();
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
    }

    // Calculate averages across the range
    const aggregated: TimeSeriesDataPoint = {
      timestamp: endDate, // Use end date as timestamp
      kpis: {
        totalUnits: Math.round(rangeData.reduce((sum, point) => sum + point.kpis.totalUnits, 0) / rangeData.length),
        defectRate: rangeData.reduce((sum, point) => sum + point.kpis.defectRate, 0) / rangeData.length,
        energyUse: Math.round(rangeData.reduce((sum, point) => sum + point.kpis.energyUse, 0) / rangeData.length),
        alerts: Math.round(rangeData.reduce((sum, point) => sum + point.kpis.alerts, 0) / rangeData.length),
      },
      networkStatus: {
        uptime: rangeData.reduce((sum, point) => sum + point.networkStatus.uptime, 0) / rangeData.length,
        avgLatency: Math.round(rangeData.reduce((sum, point) => sum + point.networkStatus.avgLatency, 0) / rangeData.length),
        energyUsage: Math.round(rangeData.reduce((sum, point) => sum + point.networkStatus.energyUsage, 0) / rangeData.length),
        avgTemp: Math.round(rangeData.reduce((sum, point) => sum + point.networkStatus.avgTemp, 0) / rangeData.length),
      },
      financialMetrics: {
        revenueYTD: rangeData.reduce((sum, point) => sum + point.financialMetrics.revenueYTD, 0) / rangeData.length,
        monthlyRevenue: rangeData.reduce((sum, point) => sum + point.financialMetrics.monthlyRevenue, 0) / rangeData.length,
        profitGrowth: rangeData.reduce((sum, point) => sum + point.financialMetrics.profitGrowth, 0) / rangeData.length,
      },
      operationalMetrics: {
        activeFactories: Math.round(rangeData.reduce((sum, point) => sum + point.operationalMetrics.activeFactories, 0) / rangeData.length),
        totalWorkers: Math.round(rangeData.reduce((sum, point) => sum + point.operationalMetrics.totalWorkers, 0) / rangeData.length),
        efficiencyRate: rangeData.reduce((sum, point) => sum + point.operationalMetrics.efficiencyRate, 0) / rangeData.length,
      },
      shareholding: {
        institutional: rangeData.reduce((sum, point) => sum + point.shareholding.institutional, 0) / rangeData.length,
        retail: rangeData.reduce((sum, point) => sum + point.shareholding.retail, 0) / rangeData.length,
        promoter: rangeData.reduce((sum, point) => sum + point.shareholding.promoter, 0) / rangeData.length,
      },
    };

    return aggregated;
  };

  // Check if current selection is in the future
  const isFutureData = (): boolean => {
    const now = new Date().getTime();
    
    if (isRange && selectedDateRange) {
      const endTime = new Date(selectedDateRange[1]).getTime();
      return endTime > now;
    } else {
      const selectedTime = new Date(selectedDate).getTime();
      return selectedTime > now;
    }
  };

  return {
    data,
    loading,
    error,
    currentDataPoint: getCurrentDataPoint(),
    isFutureData: isFutureData(),
    isRange,
    selectedDateRange,
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