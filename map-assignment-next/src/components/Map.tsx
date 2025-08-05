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
import { selectPolygon } from '@/store/slices/polygonSlice';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = "" }) => {
  // Madhyamgram coordinates
  const center: LatLngExpression = [22.6924, 88.4653];
  
  // Zoom level 14 approximates about 2 sq. km resolution
  const zoomLevel = 14;

  const dispatch = useDispatch();
  const { polygons, selectedPolygon, hiddenPolygons } = useSelector((state: RootState) => state.polygon);

  useEffect(() => {
    // This effect ensures Leaflet is loaded properly on the client side
    // The leaflet-defaulticon-compatibility package handles the icon fix
  }, []);

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
        zoomControl={true}
        doubleClickZoom={false}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marker for Madhyamgram center */}
        <Marker position={center}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">Madhyamgram</h3>
              <p className="text-sm text-gray-600">
                Lat: {center[0]}, Lng: {center[1]}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Render existing polygons */}
        {polygons.map((polygon) => {
          // Don't render hidden polygons
          if (hiddenPolygons.includes(polygon.id)) {
            return null;
          }

          // Skip polygons with no coordinates
          if (!polygon.geoJson.coordinates || !polygon.geoJson.coordinates[0] || polygon.geoJson.coordinates[0].length === 0) {
            return null;
          }

          const positions = polygon.geoJson.coordinates[0].map(
            ([lng, lat]) => [lat, lng] as LatLngExpression
          );
          
          return (
            <Polygon
              key={polygon.id}
              positions={positions}
              pathOptions={{
                color: polygon.color,
                weight: 2,
                fillOpacity: selectedPolygon === polygon.id ? 0.5 : 0.3,
              }}
              eventHandlers={{
                click: () => handlePolygonClick(polygon.id),
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold">{polygon.name}</h3>
                  <p className="text-sm text-gray-600">ID: {polygon.id}</p>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(polygon.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Drawing functionality */}
        <PolygonDrawer />
      </MapContainer>
    </div>
  );
};

export default Map;