"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Info,
  Settings,
  Globe,
  ArrowLeft,
  BarChart3,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import PolygonList from "./PolygonList";

interface MapSidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({ 
  className = "", 
  isMobileOpen = false, 
  onMobileClose = () => {} 
}) => {

  return (
    <>


      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-96 h-full bg-background border-l border-border flex flex-col
        md:relative md:translate-x-0
        ${isMobileOpen 
          ? 'fixed right-0 top-0 z-50 translate-x-0 shadow-2xl' 
          : 'fixed right-0 top-0 z-50 translate-x-full md:translate-x-0'
        }
        transition-transform duration-300 ease-in-out
        ${className}
      `}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Map Controls</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Close Button */}
            <Button
              onClick={onMobileClose}
              variant="ghost"
              size="sm"
              className="md:hidden text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Polygon List */}
        <PolygonList />
        {/* Location Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Area</span>
              <span className="text-sm font-medium">Madhyamgram</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Coordinates</span>
              <span className="text-sm font-medium">22.6924°N, 88.4653°E</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Zoom Level</span>
              <span className="text-sm font-medium">14 (2km resolution)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Region</span>
              <span className="text-sm font-medium">West Bengal, India</span>
            </div>
          </CardContent>
        </Card>

        {/* Map Layers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Map Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">OpenStreetMap</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Satellite View</span>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Terrain</span>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </CardContent>
        </Card>


        

        {/* Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-4 w-4" />
              About This Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This map displays the Madhyamgram area in West Bengal, India. 
              The map is centered at coordinates 22.6924°N, 88.4653°E with a 
              zoom level that provides approximately 2 square kilometers of 
              coverage for detailed area analysis.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Powered by OpenStreetMap & React Leaflet
        </div>
      </div>
    </div>
    </>
  );
};

export default MapSidebar;