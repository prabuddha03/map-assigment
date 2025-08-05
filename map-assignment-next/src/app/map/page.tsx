"use client";

import React, { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from 'react-redux';
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

  useEffect(() => {
    dispatch(loadSavedPolygons());
  }, [dispatch]);

  useEffect(() => {
    if (polygons.length > 0) {
      const today = new Date();
      const baseStartDate = new Date(new Date().setDate(today.getDate() - 30));
      
      const startDate = new Date(baseStartDate);
      startDate.setHours(startDate.getHours() + timeRange[0]);

      const endDate = new Date(baseStartDate);
      endDate.setHours(endDate.getHours() + timeRange[1]);

      dispatch(fetchWeatherData({ 
        polygon: polygons[0], 
        dataType, 
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      }));
    }
  }, [dataType, polygons, timeRange, dispatch]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="p-4 border-b">
        <TimelineSlider />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <Suspense fallback={<MapSkeleton />}>
            <Map className="absolute inset-0" />
          </Suspense>
        </div>
        
        <MapSidebar />
      </div>
    </div>
  );
}