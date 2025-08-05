"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ZoneData {
  continent: string;
  count: number;
  change: number;
  products: string[];
}

export default function UserbaseSplitMap() {
  const { theme } = useTheme();
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const [zonesData, setZonesData] = useState<ZoneData[]>([]);
  const [geoJson, setGeoJson] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/zones.json").then(res => res.json()),
      fetch("/time_series_data.json").then(res => res.json())
    ]).then(([zones, timeSeriesData]) => {
      setGeoJson(zones);
      
      // Find the closest data point to the selected date
      const selectedTime = new Date(selectedDate).getTime();
      const closest = timeSeriesData.reduce((prev: any, curr: any) => {
        const prevDiff = Math.abs(new Date(prev.timestamp).getTime() - selectedTime);
        const currDiff = Math.abs(new Date(curr.timestamp).getTime() - selectedTime);
        return currDiff < prevDiff ? curr : prev;
      });

      // Transform userbase data
      const transformedData = Object.entries(closest.userbase).map(([continent, data]: [string, any]) => ({
        continent,
        count: data.count,
        change: data.change,
        products: data.products,
      }));

      setZonesData(transformedData);
    });
  }, [selectedDate]);

  const getColor = (userCount: number) => {
    return userCount > 100000
      ? "#800026"
      : userCount > 50000
      ? "#BD0026"
      : userCount > 20000
      ? "#E31A1C"
      : userCount > 10000
      ? "#FC4E2A"
      : userCount > 5000
      ? "#FD8D3C"
      : userCount > 2000
      ? "#FEB24C"
      : userCount > 1000
      ? "#FED976"
      : "#FFEDA0";
  };

  const style = (feature: any) => {
    const zone = zonesData.find(
      (d) => d.continent === feature.properties.continent
    );
    return {
      fillColor: zone ? getColor(zone.count) : "#FFEDA0",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const zone = zonesData.find(
      (d) => d.continent === feature.properties.continent
    );
    
    if (zone) {
      layer.bindTooltip(
        `<div>
          <h3>${feature.properties.continent}</h3>
          <p>Active Users: ${zone.count.toLocaleString()}</p>
          <p>Change: ${zone.change > 0 ? '+' : ''}${zone.change}%</p>
          <p>Top Products: ${zone.products.slice(0, 3).join(", ")}</p>
        </div>`,
        { permanent: false, sticky: true }
      );
    }
  };

  if (!geoJson) {
    return <div>Loading Map...</div>;
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url={
          theme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />
      <GeoJSON 
        data={geoJson} 
        style={style}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}