"use client";

import React from 'react';
import { Polygon } from '@/types/polygon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface PolygonLegendProps {
  polygons: Polygon[];
  dataType: string;
}

const getDataTypeIcon = (dataType: string) => {
  switch (dataType) {
    case 'temperature_2m':
      return <Thermometer className="h-3 w-3" />;
    case 'precipitation':
      return <Droplets className="h-3 w-3" />;
    case 'wind_speed_10m':
      return <Wind className="h-3 w-3" />;
    default:
      return <Thermometer className="h-3 w-3" />;
  }
};

const getDataTypeLabel = (dataType: string) => {
  switch (dataType) {
    case 'temperature_2m':
      return 'Temperature';
    case 'precipitation':
      return 'Precipitation';
    case 'wind_speed_10m':
      return 'Wind Speed';
    default:
      return 'Temperature';
  }
};

const PolygonLegend: React.FC<PolygonLegendProps> = ({ polygons, dataType }) => {
  const { polygonData, timeRange } = useSelector((state: RootState) => state.timeline);
  const { hiddenPolygons } = useSelector((state: RootState) => state.polygon);
  
  // Show polygons that have color rules OR weather data, and are not hidden
  const visiblePolygons = polygons.filter(p => 
    !hiddenPolygons.includes(p.id) && 
    (p.colorRules.length > 0 || (polygonData[p.id] && polygonData[p.id].hourly[dataType]))
  );

  if (visiblePolygons.length === 0) {
    return null;
  }
  
  // Function to get current weather value for display
  const getCurrentValue = (polygon: Polygon): string => {
    const weatherData = polygonData[polygon.id];
    if (!weatherData || !weatherData.hourly) {
      return 'Loading...';
    }
    
    // Use the current dataType selected in the timeline
    const dataArray = weatherData.hourly[dataType];
    
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return 'No source';
    }
    
    // Ensure timeRange[0] is within bounds
    const timeIndex = Math.min(Math.max(0, timeRange[0]), dataArray.length - 1);
    let value = dataArray[timeIndex];
    let isAveraged = false;
    
    // If no data at current time, try to get a fallback average
    if (value === null || typeof value === 'undefined') {
      // Strategy 1: Look for nearby valid data points (±12 hours)
      const searchRadius = 12;
      const validValues = [];
      
      for (let offset = 0; offset <= searchRadius; offset++) {
        // Check both directions from current time
        const indices = offset === 0 ? [timeIndex] : [timeIndex - offset, timeIndex + offset];
        
        for (const idx of indices) {
          if (idx >= 0 && idx < dataArray.length) {
            const val = dataArray[idx];
            if (val !== null && typeof val !== 'undefined') {
              validValues.push(val);
            }
          }
        }
        
        // If we found some values, calculate average and break
        if (validValues.length >= 3) break;
      }
      
      if (validValues.length > 0) {
        value = validValues.reduce((sum: number, val) => sum + Number(val), 0) / validValues.length;
        isAveraged = true;
      } else {
        // Strategy 2: Get overall average from the entire dataset
        const allValidValues = dataArray.filter(val => val !== null && typeof val !== 'undefined');
        if (allValidValues.length > 0) {
          value = allValidValues.reduce((sum: number, val) => sum + Number(val), 0) / allValidValues.length;
          isAveraged = true;
        } else {
          return 'No data';
        }
      }
    }
    
    // Format based on data type
    const suffix = isAveraged ? ' (avg)' : '';
    const numValue = Number(value);
    switch (dataType) {
      case 'temperature_2m':
        return `${numValue.toFixed(1)}°C${suffix}`;
      case 'precipitation':
        return `${numValue.toFixed(1)}mm${suffix}`;
      case 'wind_speed_10m':
        return `${numValue.toFixed(1)}km/h${suffix}`;
      default:
        return `${numValue.toString()}${suffix}`;
    }
  };

  return (
    <Card className="absolute bottom-4 left-4 z-[1000] w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {getDataTypeIcon(dataType)}
          {getDataTypeLabel(dataType)} Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visiblePolygons.map((polygon) => (
          <div key={polygon.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: polygon.color }}
                />
                {polygon.name}
              </div>
              <span className="text-xs text-muted-foreground">
                {getCurrentValue(polygon)}
              </span>
            </div>
            {polygon.colorRules.length > 0 && (
              <div className="ml-5 space-y-1">
                {polygon.colorRules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rule.color }}
                    />
                    <span>
                      {rule.operator} {rule.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PolygonLegend;