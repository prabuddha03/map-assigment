"use client";

import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet-editable';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addPolygon, setDrawing } from '@/store/slices/polygonSlice';

// Types for leaflet-editable
type EditableMap = L.Map & {
  editTools?: any;
};

const PolygonDrawer: React.FC = () => {
  const map = useMap();
  const dispatch = useDispatch();
  const { isDrawing } = useSelector((state: RootState) => state.polygon);
  const [currentPolygon, setCurrentPolygon] = useState<L.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    // Initialize Leaflet.Editable
    const editableMap = map as EditableMap;
    if (!editableMap.editTools) {
      editableMap.editTools = new (L as any).Editable(map);
    }

    const handlePolygonCreated = (e: any) => {
      const layer = e.layer;
      if (layer && layer instanceof L.Polygon) {
        const latLngs = (layer.getLatLngs()[0] as L.LatLng[]).map(latlng => ({ lat: latlng.lat, lng: latlng.lng }));
        
        const coordinates = latLngs.map(latLng => [latLng.lng, latLng.lat]);
        
        if (coordinates.length > 0) {
          coordinates.push(coordinates[0]);
        }
        
        const geoJson: GeoJSON.Polygon = {
          type: 'Polygon',
          coordinates: [coordinates]
        };
        
        const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        layer.setStyle({
          color: color,
          weight: 2,
          fillOpacity: 0.3
        });

        if (coordinates.length >= 4) {
          dispatch(addPolygon({
            name: `Polygon ${Date.now()}`,
            geoJson,
            color,
            dataSource: 'temperature_2m', // Default data source
          }));
        }

        // Remove the drawing layer from the map since we are now managing it in Redux
        layer.remove();

        dispatch(setDrawing(false));
        setCurrentPolygon(null);
      }
    };

    const handleDrawingStart = () => {
      dispatch(setDrawing(true));
    };

    const handleDrawingStop = () => {
      dispatch(setDrawing(false));
      setCurrentPolygon(null);
    };

    // Listen for polygon creation events
    map.on('editable:drawing:commit', handlePolygonCreated);
    map.on('editable:drawing:start', handleDrawingStart);
    map.on('editable:drawing:end', handleDrawingStop);

    return () => {
      map.off('editable:drawing:commit', handlePolygonCreated);
      map.off('editable:drawing:start', handleDrawingStart);
      map.off('editable:drawing:end', handleDrawingStop);
    };
  }, [map, dispatch]);

  useEffect(() => {
    const editableMap = map as EditableMap;
    if (!editableMap || !editableMap.editTools) return;

    if (isDrawing && !currentPolygon) {
      // Start drawing a new polygon
      const polygon = editableMap.editTools.startPolygon();
      setCurrentPolygon(polygon);
    } else if (!isDrawing && currentPolygon) {
      // Stop drawing if we're no longer in drawing mode
      if (currentPolygon && (currentPolygon as any).editor) {
        (currentPolygon as any).editor.disable();
      }
      setCurrentPolygon(null);
    }
  }, [isDrawing, map, currentPolygon]);

  return null;
};

export default PolygonDrawer;