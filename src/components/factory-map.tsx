"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Expand, MapPin, TrendingUp } from "lucide-react";
import ReportModal from "./report-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Factory {
  id: number;
  name: string;
  position: [number, number];
  status: "healthy" | "warning" | "critical";
  stats: {
    production: number;
    efficiency: number;
    temperature: number;
  };
}

interface FactoryMapProps {
  onSelectFactory: (factoryId: number | null) => void;
}

export default function FactoryMap({ onSelectFactory }: FactoryMapProps) {
  const { theme } = useTheme();
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedFactoryForReport, setSelectedFactoryForReport] = useState<number | null>(null);

  useEffect(() => {
    // Load time-series data and update factory statuses based on selected date
    Promise.all([
      fetch("/factories.json").then(res => res.json()),
      fetch("/time_series_data.json").then(res => res.json())
    ]).then(([factoriesData, timeSeriesData]) => {
      const selectedTime = new Date(selectedDate).getTime();
      const closest = timeSeriesData.reduce((prev: any, curr: any) => {
        const prevDiff = Math.abs(new Date(prev.timestamp).getTime() - selectedTime);
        const currDiff = Math.abs(new Date(curr.timestamp).getTime() - selectedTime);
        return currDiff < prevDiff ? curr : prev;
      });

      const updatedFactories = factoriesData.map((factory: Factory) => {
        const timeData = closest.factories.find((f: any) => f.id === factory.id);
        if (timeData) {
          return {
            ...factory,
            status: timeData.status,
            stats: {
              ...factory.stats,
              production: timeData.production,
            }
          };
        }
        return factory;
      });

      setFactories(updatedFactories);
    });
  }, [selectedDate]);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "#22c55e"; // green
      case "warning":
        return "#f59e0b"; // orange
      case "critical":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const createCustomIcon = (status: string) => {
    const color = getMarkerColor(status);
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin" style="background-color: ${color};"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  };

  const handleLaunchReport = (factoryId: number) => {
    setSelectedFactoryForReport(factoryId);
    setIsReportOpen(true);
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Our factories in map</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Expand className="h-4 w-4 mr-2" />
                Expand Map
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Factory Locations - Expanded View</DialogTitle>
              </DialogHeader>
              <div className="h-[60vh]">
                <MapContainer
                  center={[22.5726, 88.3639]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url={
                      theme === "dark"
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                  />
                  {factories.map((factory) => (
                    <Marker
                      key={factory.id}
                      position={factory.position}
                      icon={createCustomIcon(factory.status)}
                    >
                      <Tooltip>
                        <div>
                          <h4 className="font-semibold">{factory.name}</h4>
                          <p>Production: {factory.stats.production}</p>
                          <p>Status: {factory.status}</p>
                        </div>
                      </Tooltip>
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-semibold mb-2">{factory.name}</h4>
                          <div className="space-y-1 text-sm">
                            <p>Production: {factory.stats.production} units</p>
                            <p>Efficiency: {factory.stats.efficiency}%</p>
                            <p>Temperature: {factory.stats.temperature}°C</p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => onSelectFactory(factory.id)}
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLaunchReport(factory.id)}
                            >
                              Launch Report
                            </Button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-1">
          <MapContainer
            center={[22.5726, 88.3639]}
            zoom={11}
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
            {factories.map((factory) => (
              <Marker
                key={factory.id}
                position={factory.position}
                icon={createCustomIcon(factory.status)}
              >
                <Tooltip>
                  <div>
                    <h4 className="font-semibold">{factory.name}</h4>
                    <p>Production: {factory.stats.production}</p>
                    <p>Status: {factory.status}</p>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold mb-2">{factory.name}</h4>
                    <div className="space-y-1 text-sm">
                      <p>Production: {factory.stats.production} units</p>
                      <p>Efficiency: {factory.stats.efficiency}%</p>
                      <p>Temperature: {factory.stats.temperature}°C</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => onSelectFactory(factory.id)}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLaunchReport(factory.id)}
                      >
                        Launch Report
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        factoryId={selectedFactoryForReport}
      />
    </>
  );
}