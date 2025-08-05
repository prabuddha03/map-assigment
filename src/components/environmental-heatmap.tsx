"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

const data = [
  { subject: "Temperature", A: 120, B: 110, fullMark: 150 },
  { subject: "Humidity", A: 98, B: 130, fullMark: 150 },
  { subject: "Air Quality", A: 86, B: 130, fullMark: 150 },
  { subject: "Noise", A: 99, B: 100, fullMark: 150 },
  { subject: "Light", A: 85, B: 90, fullMark: 150 },
];

export default function EnvironmentalHeatmap() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis />
        <Radar
          name="Zone A"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Zone B"
          dataKey="B"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}