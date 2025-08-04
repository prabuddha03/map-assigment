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
  const totalHours = Math.floor(totalRange / (60 * 60 * 1000)); // Total hours in the range

  // Helper function to round to nearest hour
  const roundToNearestHour = (date: Date) => {
    const rounded = new Date(date);
    rounded.setMinutes(0, 0, 0);
    return rounded;
  };

  const handleSliderChange = (values: number[]) => {
    if (isRange && values.length === 2) {
      // Convert slider values to hour indices, then to exact hour timestamps
      const startHourIndex = Math.round((values[0] / 100) * totalHours);
      const endHourIndex = Math.round((values[1] / 100) * totalHours);
      
      const startDate = roundToNearestHour(new Date(minTimestamp + startHourIndex * 60 * 60 * 1000));
      const endDate = roundToNearestHour(new Date(minTimestamp + endHourIndex * 60 * 60 * 1000));
      
      dispatch(setDateRange([startDate.toISOString(), endDate.toISOString()]));
    } else {
      // Convert slider value to hour index, then to exact hour timestamp
      const hourIndex = Math.round((values[0] / 100) * totalHours);
      const newDate = roundToNearestHour(new Date(minTimestamp + hourIndex * 60 * 60 * 1000));
      dispatch(setDate(newDate.toISOString()));
    }
  };

  const getCurrentSliderValue = () => {
    if (isRange && selectedDateRange) {
      // Convert timestamps back to hour indices, then to percentages
      const startHourIndex = Math.round((new Date(selectedDateRange[0]).getTime() - minTimestamp) / (60 * 60 * 1000));
      const endHourIndex = Math.round((new Date(selectedDateRange[1]).getTime() - minTimestamp) / (60 * 60 * 1000));
      
      const startPercent = (startHourIndex / totalHours) * 100;
      const endPercent = (endHourIndex / totalHours) * 100;
      return [startPercent, endPercent];
    } else {
      // Convert timestamp back to hour index, then to percentage
      const hourIndex = Math.round((new Date(selectedDate).getTime() - minTimestamp) / (60 * 60 * 1000));
      const percent = (hourIndex / totalHours) * 100;
      return [percent];
    }
  };

  const handleToggleChange = (checked: boolean) => {
    dispatch(setIsRange(checked));
    if (checked && !selectedDateRange) {
      // Initialize range with a proper range (current date - 2 hours to current date + 2 hours)
      const currentDate = roundToNearestHour(new Date(selectedDate));
      const startDate = new Date(currentDate.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
      const endDate = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after
      
      // Ensure the range stays within min/max bounds and round to nearest hour
      const minDateTime = new Date(minDate).getTime();
      const maxDateTime = new Date(maxDate).getTime();
      
      const boundedStartDate = roundToNearestHour(new Date(Math.max(startDate.getTime(), minDateTime)));
      const boundedEndDate = roundToNearestHour(new Date(Math.min(endDate.getTime(), maxDateTime)));
      
      dispatch(setDateRange([boundedStartDate.toISOString(), boundedEndDate.toISOString()]));
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
              step={100 / totalHours} // Step by exactly one hour
              className="w-full"
              {...(isRange && { 
                defaultValue: [25, 75],
                minStepsBetweenThumbs: 100 / totalHours // Minimum gap of 1 hour
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