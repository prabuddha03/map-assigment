"use client";

import React, { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from 'react-redux';
import { loadSavedPolygons } from '@/store/slices/polygonSlice';
import MapSidebar from "@/components/MapSidebar";
import MapSkeleton from "@/components/map-skeleton";



const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <MapSkeleton />,
  ssr: false,
    });

export default function MapPage() {
  const dispatch = useDispatch();

  // Load saved polygons on page mount
  useEffect(() => {
    dispatch(loadSavedPolygons());
  }, [dispatch]);

  return (
    <div className="flex h-screen w-full">
      {/* Main Map Area */}
      <div className="flex-1 relative">
        <Suspense fallback={<MapSkeleton />}>
          <Map className="absolute inset-0" />
        </Suspense>
      </div>
      
      {/* Right Sidebar */}
      <MapSidebar />
    </div>
  );
}