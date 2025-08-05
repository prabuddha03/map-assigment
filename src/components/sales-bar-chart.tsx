"use client";

import {
  BarChart,
  Bar,
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

const salesData = [
  { date: "2024-12-10", products: [
    { name: "Product A", sold: 4200 },
    { name: "Product B", sold: 3800 },
    { name: "Product C", sold: 3200 },
    { name: "Product D", sold: 2800 },
    { name: "Product E", sold: 2200 }
  ]},
  { date: "2024-12-25", products: [
    { name: "Product A", sold: 5200 },
    { name: "Product B", sold: 4600 },
    { name: "Product C", sold: 4200 },
    { name: "Product D", sold: 3800 },
    { name: "Product E", sold: 3200 }
  ]},
  { date: "2025-01-08", products: [
    { name: "Product A", sold: 6200 },
    { name: "Product B", sold: 5600 },
    { name: "Product C", sold: 5200 },
    { name: "Product D", sold: 4800 },
    { name: "Product E", sold: 4200 }
  ]}
];

export default function SalesBarChart() {
  const selectedDate = useSelector((state: RootState) => state.date.selectedDate);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const selectedTime = new Date(selectedDate).getTime();
    const closest = salesData.reduce((prev, curr) => {
      const prevDiff = Math.abs(new Date(prev.date).getTime() - selectedTime);
      const currDiff = Math.abs(new Date(curr.date).getTime() - selectedTime);
      return currDiff < prevDiff ? curr : prev;
    });

    setData(closest.products);
  }, [selectedDate]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
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
        <Bar dataKey="sold" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}