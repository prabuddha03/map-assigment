"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import PolygonDrawer from "./PolygonDrawer";
import DrawingControls from "./DrawingControls";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { selectPolygon, updatePolygon } from '@/store/slices/polygonSlice';
import { getPolygonColor, fetchWeatherData } from '@/store/slices/timelineSlice';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { polygons, selectedPolygon, hiddenPolygons } = useSelector((state: RootState) => state.polygon);
  const { data: weatherData, timeRange, dataType } = useSelector((state: RootState) => state.timeline);

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
        }));
      });
    }
  }, [polygons, timeRange, dataType, dispatch]);

  const handlePolygonClick = (polygonId: string) => {
    dispatch(selectPolygon(polygonId));
  };

  return (
    <div className={`h-full w-full relative ${className}`}>
      <DrawingControls />
      <MapContainer
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={false}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={center}>
          <Popup>Madhyamgram</Popup>
        </Marker>

        {polygons.map((polygon) => {
          if (hiddenPolygons.includes(polygon.id) || !polygon.geoJson.coordinates?.[0]?.length) {
            return null;
          }

          const color = getPolygonColor(polygon, weatherData, timeRange[0]);

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
              }}
              eventHandlers={{
                click: () => handlePolygonClick(polygon.id),
              }}
            >
              <Popup>
                {polygon.name} - {color}
              </Popup>
            </Polygon>
          );
        })}

        <PolygonDrawer />
      </MapContainer>
    </div>
  );
};

export default Map;