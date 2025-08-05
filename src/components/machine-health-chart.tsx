"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

const healthData = [
  { 
    date: "2024-12-10", 
    machines: [
      { name: "Machine A", uptime: 85, downtime: 15 },
      { name: "Machine B", uptime: 92, downtime: 8 },
      { name: "Machine C", uptime: 78, downtime: 22 },
      { name: "Machine D", uptime: 88, downtime: 12 }
    ]
  },
  { 
    date: "2024-12-25", 
    machines: [
      { name: "Machine A", uptime: 90, downtime: 10 },
      { name: "Machine B", uptime: 95, downtime: 5 },
      { name: "Machine C", uptime: 82, downtime: 18 },
      { name: "Machine D", uptime: 91, downtime: 9 }
    ]
  },
  { 
    date: "2025-01-08", 
    machines: [
      { name: "Machine A", uptime: 94, downtime: 6 },
      { name: "Machine B", uptime: 97, downtime: 3 },
      { name: "Machine C", uptime: 89, downtime: 11 },
      { name: "Machine D", uptime: 93, downtime: 7 }
    ]
  }
];

export default function MachineHealthChart() {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const selectedTime = new Date(selectedDate).getTime();
    const closest = healthData.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.date).getTime() - selectedTime);
      const currDiff = Math.abs(new Date(curr.date).getTime() - selectedTime);
      return currDiff < prevDiff ? curr : prev;
    });

    setData(closest.machines);
  }, [selectedDate]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="uptime"
          stroke="#22c55e"
          name="Uptime %"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="downtime"
          stroke="#ef4444"
          name="Downtime %"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}