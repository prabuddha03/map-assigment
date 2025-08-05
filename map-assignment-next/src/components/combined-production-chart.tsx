"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

interface TimeSeriesData {
  timestamp: string;
  factories: Array<{
    id: number;
    name: string;
    production: number;
    status: string;
    energy: number;
  }>;
}

export default function CombinedProductionChart() {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/time_series_data.json")
      .then((res) => res.json())
      .then((timeSeriesData: TimeSeriesData[]) => {
        // Find the closest data point to the selected date
        const selectedTime = new Date(selectedDate).getTime();
        const closest = timeSeriesData.reduce((prev, curr) => {
          const prevDiff = Math.abs(new Date(prev.timestamp).getTime() - selectedTime);
          const currDiff = Math.abs(new Date(curr.timestamp).getTime() - selectedTime);
          return currDiff < prevDiff ? curr : prev;
        });

        // Generate chart data based on the selected time period
        const chartData = closest.factories.map((factory) => ({
          name: factory.name,
          production: factory.production,
          energy: factory.energy,
        }));

        setData(chartData);
      });
  }, [selectedDate]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <defs>
          <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="production"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorProduction)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}