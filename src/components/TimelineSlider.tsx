"use client";

import React, { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setDataType, setTimeRange } from '@/store/slices/timelineSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Wind, Droplets } from 'lucide-react';

// Define the data types for the dropdown
const dataTypes = [
  { value: 'temperature_2m', label: 'Temperature', icon: Thermometer },
  { value: 'precipitation', label: 'Precipitation', icon: Droplets },
  { value: 'wind_speed_10m', label: 'Wind Speed', icon: Wind },
];

const TimelineSlider = () => {
  const dispatch = useDispatch();
  const { dataType, timeRange } = useSelector((state: RootState) => state.timeline);

  const today = new Date();
  const startDate = useMemo(() => new Date(new Date().setDate(today.getDate() - 30)), [today]);
  
  const totalHours = 30 * 24;

  const handleSliderChange = (newRange: number[]) => {
    console.log('Slider changed:', newRange);
    dispatch(setTimeRange(newRange as [number, number]));
  };

  const handleDataTypeChange = (value: string) => {
    dispatch(setDataType(value));
  };

  // Function to convert slider value (hours) to a formatted date string
  const formatHourToDate = (hours: number) => {
    const date = new Date(startDate);
    date.setHours(date.getHours() + hours);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const SelectedIcon = dataTypes.find(dt => dt.value === dataType)?.icon || Thermometer;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Timeline Control</CardTitle>
          <div className="w-48">
            <Select onValueChange={handleDataTypeChange} defaultValue={dataType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                {dataTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 pt-2">
          <Slider
            min={0}
            max={totalHours}
            step={1}
            value={timeRange}
            onValueChange={handleSliderChange}
            minStepsBetweenThumbs={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{formatHourToDate(timeRange[0])}</span>
            <span>{formatHourToDate(timeRange[1])}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineSlider;
