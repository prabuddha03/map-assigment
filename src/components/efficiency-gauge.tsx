"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

const efficiencyData = [
  { date: "2024-12-10", efficiency: 78 },
  { date: "2024-12-25", efficiency: 85 },
  { date: "2025-01-08", efficiency: 92 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function EfficiencyGauge() {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const [efficiency, setEfficiency] = useState(85);

  useEffect(() => {
    const selectedTime = new Date(selectedDate).getTime();
    const closest = efficiencyData.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.date).getTime() - selectedTime);
      const currDiff = Math.abs(new Date(curr.date).getTime() - selectedTime);
      return currDiff < prevDiff ? curr : prev;
    });

    setEfficiency(closest.efficiency);
  }, [selectedDate]);

  const data = [
    { name: 'Efficiency', value: efficiency },
    { name: 'Remaining', value: 100 - efficiency }
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={180}
          endAngle={0}
          innerRadius={80}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-2xl font-bold">
          {efficiency}%
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}