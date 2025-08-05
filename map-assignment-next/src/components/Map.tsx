"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import PolygonDrawer from "./PolygonDrawer";
import DrawingControls from "./DrawingControls";
import PolygonLegend from "./PolygonLegend";
import MobileMapControls from "./MobileMapControls";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { selectPolygon, updatePolygon } from '@/store/slices/polygonSlice';
import { getPolygonColor, fetchWeatherData } from '@/store/slices/timelineSlice';
import { Polygon as PolygonType } from '@/types/polygon';

interface MapProps {
  className?: string;
  onOpenMobileSidebar?: () => void;
  isSidebarOpen?: boolean;
  onZoomChange?: (zoomLevel: number) => void;
  onCenterChange?: (center: LatLngExpression) => void;
}

const Map: React.FC<MapProps> = ({ 
  className = "", 
  onOpenMobileSidebar = () => {},
  isSidebarOpen = false,
  onZoomChange = () => {},
  onCenterChange = () => {}
}) => {
  const dispatch = useDispatch();
  const { polygons, selectedPolygon, hiddenPolygons } = useSelector((state: RootState) => state.polygon);
  const { polygonData, timeRange, dataType } = useSelector((state: RootState) => state.timeline);
  
  const MapEvents = () => {
    const map = useMapEvents({
      zoomend: () => {
        onZoomChange(map.getZoom());
        onCenterChange(map.getCenter());
      },
      moveend: () => {
        onCenterChange(map.getCenter());
      },
    });
    return null;
  };
  
  // Function to get weather value for tooltip
  const getWeatherValue = (polygon: PolygonType, timeIndex: number): string => {
    const weatherData = polygonData[polygon.id];
    if (!weatherData || !weatherData.hourly) {
      return 'Loading...';
    }

    const dataArray = weatherData.hourly[dataType];

    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      return 'No source';
    }

    if (dataArray.some(v => typeof v === 'string')) {
      return 'Invalid data type';
    }
    const numericDataArray = dataArray as (number | null)[];

    const safeTimeIndex = Math.min(Math.max(0, timeIndex), numericDataArray.length - 1);
    let value: number | null | undefined = numericDataArray[safeTimeIndex];
    let isAveraged = false;

    if (value === null || typeof value === 'undefined') {
      const searchRadius = 12;
      const validValues: number[] = [];

      for (let offset = 0; offset <= searchRadius; offset++) {
        const indices = offset === 0 ? [safeTimeIndex] : [safeTimeIndex - offset, safeTimeIndex + offset];
        for (const idx of indices) {
          if (idx >= 0 && idx < numericDataArray.length) {
            const val = numericDataArray[idx];
            if (val !== null && typeof val !== 'undefined') {
              validValues.push(val);
            }
          }
        }
        if (validValues.length >= 3) break;
      }

      if (validValues.length > 0) {
        value = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
        isAveraged = true;
      } else {
        const allValidValues = numericDataArray.filter((v): v is number => v !== null && typeof v !== 'undefined');
        if (allValidValues.length > 0) {
          value = allValidValues.reduce((sum, val) => sum + val, 0) / allValidValues.length;
          isAveraged = true;
        } else {
          return 'No data';
        }
      }
    }

    if (value === null || typeof value === 'undefined') {
      return 'No data';
    }

    const suffix = isAveraged ? ' (avg)' : '';
    switch (dataType) {
      case 'temperature_2m':
        return `${value.toFixed(1)}°C${suffix}`;
      case 'precipitation':
        return `${value.toFixed(1)}mm${suffix}`;
      case 'wind_speed_10m':
        return `${value.toFixed(1)}km/h${suffix}`;
      default:
        return `${value.toString()}${suffix}`;
    }
  };

  const center: LatLngExpression = [22.6924, 88.4653];
  const zoomLevel = 14;

  useEffect(() => {
    if (polygons.length > 0) {
      const today = new Date();
      const startDate = new Date(new Date().setDate(today.getDate() - 30));
      const endDate = new Date();

      polygons.forEach(polygon => {
        dispatch(fetchWeatherData({
          polygon,
          dataType,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }) as any);
      });
    }
  }, [polygons, timeRange, dataType, dispatch]);

  const handlePolygonClick = (polygonId: string) => {
    dispatch(selectPolygon(polygonId));
  };

  // Helper function to get polygon point count
  const getPolygonPointCount = (geoJson: GeoJSON.Polygon) => {
    if (!geoJson.coordinates || !geoJson.coordinates[0] || geoJson.coordinates[0].length === 0) {
      return 0;
    }
    const coords = geoJson.coordinates[0];
    return Math.max(0, coords.length - 1);
  };

  return (
    <div className={`h-full w-full relative transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50 z-0' : 'opacity-100 z-10'} ${className}`}>
      {/* CSS for smooth transitions */}
      <style jsx global>{`
        .polygon-transition {
          transition: all 0.3s ease-in-out !important;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .leaflet-control-container .leaflet-top.leaflet-right {
            top: 60px;
            right: 10px;
          }
          .leaflet-control-container .leaflet-bottom.leaflet-left {
            bottom: 10px;
            left: 10px;
          }
        }
      `}</style>
      
      <MobileMapControls onOpenSidebar={onOpenMobileSidebar} />
      <DrawingControls />
      
      <MapContainer
        center={center}
        zoom={16.5}
        zoomSnap={0.1}
        scrollWheelZoom={false}
        className="h-full w-full rounded-lg"
      >
                <MapEvents />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polygons.map((polygon) => {
          if (hiddenPolygons.includes(polygon.id) || !polygon.geoJson.coordinates?.[0]?.length) {
            return null;
          }

          const color = getPolygonColor(polygon, polygonData, dataType, timeRange[0]);

          const positions = polygon.geoJson.coordinates[0].map(
            ([lng, lat]) => [lat, lng] as LatLngExpression
          );
          
          return (
            <Polygon
              key={polygon.id}
              positions={positions}
              pathOptions={{
                color: color,
                weight: 2,
                fillOpacity: selectedPolygon === polygon.id ? 0.7 : 0.5,
                className: 'polygon-transition',
              }}
              eventHandlers={{
                click: () => handlePolygonClick(polygon.id),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">{polygon.name}</div>
                  <div className="space-y-1">
                    <div>Value: {getWeatherValue(polygon, timeRange[0])}</div>
                    <div>Color: <span className="inline-block w-3 h-3 rounded-full ml-1" style={{ backgroundColor: color }}></span></div>
                    <div className="text-xs text-muted-foreground">
                      {getPolygonPointCount(polygon.geoJson)} points
                    </div>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        <PolygonDrawer />
      </MapContainer>
      
      <PolygonLegend polygons={polygons} dataType={dataType} />
    </div>
  );
};

export default Map;