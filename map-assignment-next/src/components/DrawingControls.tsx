"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setDrawing, saveAllPolygons, clearUnsavedPolygons } from '@/store/slices/polygonSlice';
import { Button } from '@/components/ui/button';
import { Hexagon, Save, Trash2 } from 'lucide-react';

interface DrawingControlsProps {
  className?: string;
}

const DrawingControls: React.FC<DrawingControlsProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { isDrawing, polygons, savedPolygons } = useSelector((state: RootState) => state.polygon);

  const handleStartDrawing = () => {
    dispatch(setDrawing(true));
  };

  const handleStopDrawing = () => {
    dispatch(setDrawing(false));
  };

  const handleSaveAll = () => {
    dispatch(saveAllPolygons());
  };

  const handleClearUnsaved = () => {
    dispatch(clearUnsavedPolygons());
  };

  const unsavedCount = polygons.filter(p => !savedPolygons.some(s => s.id === p.id)).length;

  return (
    <div className={`absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border ${className}`}>
      <div className="flex flex-col gap-2">
        <Button
          variant={isDrawing ? "default" : "outline"}
          size="sm"
          onClick={isDrawing ? handleStopDrawing : handleStartDrawing}
          className="flex items-center gap-2"
        >
          <Hexagon className="h-4 w-4" />
          {isDrawing ? 'Stop Drawing' : 'Draw Polygon'}
        </Button>

        {polygons.length > 0 && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveAll}
              disabled={unsavedCount === 0}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save All ({unsavedCount})
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearUnsaved}
              disabled={unsavedCount === 0}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Unsaved
            </Button>
          </>
        )}
        
        <div className="text-xs text-muted-foreground text-center">
          {isDrawing ? (
            <span className="text-blue-600 dark:text-blue-400">
              Click to add points, double-click to finish
            </span>
          ) : (
            <div>
              <div>{polygons.length} total</div>
              <div>{savedPolygons.length} saved</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingControls;