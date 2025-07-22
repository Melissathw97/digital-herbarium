"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", ocr: 186, ai: 59 },
  { month: "February", ocr: 201, ai: 13 },
  { month: "March", ocr: 237, ai: 40 },
  { month: "April", ocr: 73, ai: 52 },
  { month: "May", ocr: 92, ai: 38 },
  { month: "June", ocr: 114, ai: 24 },
  { month: "July", ocr: 68, ai: 49 },
  { month: "August", ocr: 120, ai: 87 },
  { month: "September", ocr: 103, ai: 43 },
  { month: "October", ocr: 167, ai: 56 },
  { month: "November", ocr: 93, ai: 96 },
  { month: "December", ocr: 136, ai: 82 },
];

const chartConfig = {
  ocr: {
    label: "OCR",
    color: "var(--chart-4)",
  },
  ai: {
    label: "AI",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DataCollectionChart() {
  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-7 border flex flex-col gap-8 w-full max-w-[480px]">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Data Collection</p>
        <p>January - December 2025</p>
      </div>
      <div className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="ocr" fill="var(--color-ocr)" radius={4} />
            <Bar dataKey="ai" fill="var(--color-ai)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
