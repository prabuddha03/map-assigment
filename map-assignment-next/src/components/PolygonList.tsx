"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  removePolygon, 
  selectPolygon, 
  togglePolygonVisibility, 
  savePolygon 
} from '@/store/slices/polygonSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Hexagon as PolygonIcon, 
  Eye,
  EyeOff,
  MapPin,
  Save
} from 'lucide-react';

const PolygonList: React.FC = () => {
  const dispatch = useDispatch();
  const { polygons, savedPolygons, selectedPolygon, hiddenPolygons } = useSelector((state: RootState) => state.polygon);

  const handleDelete = (id: string) => {
    dispatch(removePolygon(id));
  };

  const handleSelect = (id: string) => {
    const isCurrentlySelected = selectedPolygon === id;
    dispatch(selectPolygon(isCurrentlySelected ? null : id));
  };

  const handleToggleVisibility = (id: string) => {
    dispatch(togglePolygonVisibility(id));
  };

  const handleSavePolygon = (id: string) => {
    dispatch(savePolygon(id));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPolygonPointCount = (geoJson: GeoJSON.Polygon) => {
    if (!geoJson.coordinates || !geoJson.coordinates[0] || geoJson.coordinates[0].length === 0) {
      return 0;
    }
    const coords = geoJson.coordinates[0];
    // Subtract 1 because the last point is same as first point (closing the polygon)
    return Math.max(0, coords.length - 1);
  };

  const isPolygonSaved = (id: string) => {
    return savedPolygons.some(saved => saved.id === id);
  };

  if (polygons.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PolygonIcon className="h-4 w-4" />
            Drawn Polygons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <PolygonIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No polygons drawn yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Draw Polygon" to start drawing
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <PolygonIcon className="h-4 w-4" />
          Drawn Polygons
          <div className="ml-auto flex gap-1">
            <Badge variant="secondary">
              {polygons.length} total
            </Badge>
            <Badge variant="outline">
              {savedPolygons.length} saved
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {polygons.map((polygon) => {
          const isSelected = selectedPolygon === polygon.id;
          const isHidden = hiddenPolygons.includes(polygon.id);
          const isSaved = isPolygonSaved(polygon.id);
          
          return (
            <div
              key={polygon.id}
              className={`p-3 rounded-lg border transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/10' 
                  : isHidden
                  ? 'border-border bg-muted/30 opacity-50'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: polygon.color }}
                    />
                    <h4 className="text-sm font-medium truncate">
                      {polygon.name}
                    </h4>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {getPolygonPointCount(polygon.geoJson)} points
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Created: {formatDate(new Date(polygon.createdAt))}
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {polygon.dataSource && (
                        <Badge variant="outline" className="text-xs">
                          {polygon.dataSource}
                        </Badge>
                      )}
                      {isSaved && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          saved
                        </Badge>
                      )}
                      {isHidden && (
                        <Badge variant="secondary" className="text-xs">
                          hidden
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 ml-2">
                  {/* Save Button */}
                  {!isSaved && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSavePolygon(polygon.id)}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-950/20"
                      title="Save polygon"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                  )}

                  {/* Visibility Toggle Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVisibility(polygon.id)}
                    className="h-6 w-6 p-0"
                    title={isHidden ? "Show polygon" : "Hide polygon"}
                  >
                    {isHidden ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>

                  {/* Select Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelect(polygon.id)}
                    className={`h-6 w-6 p-0 ${
                      isSelected 
                        ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20' 
                        : ''
                    }`}
                    title={isSelected ? "Deselect polygon" : "Select polygon"}
                  >
                    <MapPin className="h-3 w-3" />
                  </Button>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(polygon.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Delete polygon"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PolygonList;