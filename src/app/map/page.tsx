"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from 'react-redux';
import { LatLngExpression } from 'leaflet';
import { loadSavedPolygons } from '@/store/slices/polygonSlice';
import { fetchWeatherData } from '@/store/slices/timelineSlice';
import { RootState, AppDispatch } from '@/store/store';
import MapSidebar from "@/components/MapSidebar";
import MapSkeleton from "@/components/map-skeleton";
import TimelineSlider from "@/components/TimelineSlider";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

export default function MapPage() {
  const dispatch: AppDispatch = useDispatch();
  const { dataType, timeRange } = useSelector((state: RootState) => state.timeline);
  const { polygons } = useSelector((state: RootState) => state.polygon);
  const [center, setCenter] = useState<LatLngExpression>([22.6924, 88.4653]);
  const [zoomLevel, setZoomLevel] = useState(16.5);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    dispatch(loadSavedPolygons());
    // Ensure map loads properly by setting ready state after mount
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (polygons.length > 0) {
      // Base date is 30 days ago from today
      const today = new Date();
      const baseStartDate = new Date(today);
      baseStartDate.setDate(today.getDate() - 30);
      baseStartDate.setHours(0, 0, 0, 0); // Reset to start of day
      
      // Calculate actual start and end dates based on timeRange (hours from base date)
      const startDate = new Date(baseStartDate);
      startDate.setHours(startDate.getHours() + timeRange[0]);

      const endDate = new Date(baseStartDate);
      endDate.setHours(endDate.getHours() + timeRange[1]);

      console.log('Time range changed:', {
        timeRange,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dataType
      });

      // Fetch weather data for all polygons, not just the first one
      polygons.forEach(polygon => {
        dispatch(fetchWeatherData({ 
          polygon, 
          dataType, 
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }));
      });
    }
  }, [dataType, polygons, timeRange, dispatch]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="p-4 border-b">
        <TimelineSlider />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative md:flex-row flex-col">
        <div className="flex-1 relative h-[60vh] md:h-full w-full">
          <Suspense fallback={<MapSkeleton />}>
            {isMapReady ? (
              <Map 
                className="h-full w-full" 
                onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
                isSidebarOpen={isMobileSidebarOpen}
                onZoomChange={setZoomLevel}
                onCenterChange={setCenter}
              />
            ) : (
              <MapSkeleton />
            )}
          </Suspense>
        </div>
        
        <MapSidebar 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          className="md:w-96 w-full h-full"
          zoomLevel={zoomLevel}
          center={center}
        />
      </div>
    </div>
  );
}