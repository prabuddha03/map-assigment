"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setDate, setDateRange, setIsRange } from "@/store/slices/dateSlice";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export default function SliderControl() {
  const dispatch = useDispatch();
  const { selectedDate, selectedDateRange, isRange, minDate, maxDate } = useSelector(
    (state: RootState) => state.date
  );

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set initial time on client mount to prevent hydration mismatch
    setIsClient(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minTimestamp = new Date(minDate).getTime();
  const maxTimestamp = new Date(maxDate).getTime();
  const totalRange = maxTimestamp - minTimestamp;

  const handleSliderChange = (values: number[]) => {
    if (isRange && values.length === 2) {
      const startDate = new Date(minTimestamp + (values[0] / 100) * totalRange);
      const endDate = new Date(minTimestamp + (values[1] / 100) * totalRange);
      dispatch(setDateRange([startDate.toISOString(), endDate.toISOString()]));
    } else {
      const newDate = new Date(minTimestamp + (values[0] / 100) * totalRange);
      dispatch(setDate(newDate.toISOString()));
    }
  };

  const getCurrentSliderValue = () => {
    if (isRange && selectedDateRange) {
      const startPercent = ((new Date(selectedDateRange[0]).getTime() - minTimestamp) / totalRange) * 100;
      const endPercent = ((new Date(selectedDateRange[1]).getTime() - minTimestamp) / totalRange) * 100;
      return [startPercent, endPercent];
    } else {
      const percent = ((new Date(selectedDate).getTime() - minTimestamp) / totalRange) * 100;
      return [percent];
    }
  };

  const handleToggleChange = (checked: boolean) => {
    dispatch(setIsRange(checked));
    if (checked && !selectedDateRange) {
      // Initialize range with current date as both start and end
      const currentDateISO = new Date(selectedDate).toISOString();
      dispatch(setDateRange([currentDateISO, currentDateISO]));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Time Control</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Single</span>
            <Switch
              checked={isRange}
              onCheckedChange={handleToggleChange}
            />
            <span className="text-sm">Range</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">
            {isClient && currentTime ? format(currentTime, "PPP") : "Loading..."}
          </div>
          <div className="text-sm text-muted-foreground">
            {isClient && currentTime ? format(currentTime, "pp") : "--:--:-- --"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="px-3">
            <Slider
              value={getCurrentSliderValue()}
              onValueChange={handleSliderChange}
              max={100}
              step={0.1}
              className="w-full"
              {...(isRange && { 
                defaultValue: [25, 75],
                minStepsBetweenThumbs: 1
              })}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{format(new Date(minDate), "MMM dd")}</span>
            <span>
              {isRange && selectedDateRange
                ? `${format(new Date(selectedDateRange[0]), "MMM dd, HH:mm")} - ${format(new Date(selectedDateRange[1]), "MMM dd, HH:mm")}`
                : format(new Date(selectedDate), "MMM dd, HH:mm")}
            </span>
            <span>{format(new Date(maxDate), "MMM dd")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}