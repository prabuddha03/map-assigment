"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setIsPlaying,
  setPlaybackSpeed,
  advanceTime,
} from "@/store/slices/dateSlice";
import { useEffect } from "react";

export default function PlaybackControls() {
  const dispatch = useDispatch();
  const { isPlaying, playbackSpeed, isRange } = useSelector(
    (state: RootState) => state.date
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isRange) {
      const delay = 1000 / playbackSpeed; // Base delay of 1 second, adjusted by speed
      interval = setInterval(() => {
        dispatch(advanceTime());
      }, delay);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, playbackSpeed, isRange, dispatch]);

  // Auto-pause when switching to range mode
  useEffect(() => {
    if (isRange && isPlaying) {
      dispatch(setIsPlaying(false));
    }
  }, [isRange, isPlaying, dispatch]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Playback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col items-center gap-2">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="sm"
            onClick={() => dispatch(setIsPlaying(!isPlaying))}
            className="w-20"
            disabled={isRange}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 mr-1" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          {isRange && (
            <p className="text-xs text-muted-foreground text-center">
              Playback disabled in range mode
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Speed</label>
          <Select
            value={playbackSpeed.toString()}
            onValueChange={(value) =>
              dispatch(setPlaybackSpeed(parseInt(value) as 1 | 2 | 4))
            }
            disabled={isRange}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="4">4x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}