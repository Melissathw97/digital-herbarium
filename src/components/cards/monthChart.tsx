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
import { Month } from "@/types/dashboard";
import { useEffect, useMemo, useState } from "react";
import { getYearByMonths } from "@/services/dashboardServices";

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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{ year: number, months: Month[] }>();

  const chartData = useMemo(() => {
    return data?.months.map((month, index) => ({
      month: months[index + 1],
      ocr: month["OCR"],
      ai: month["AI Detection"]
    }))
  }, [data]);

  useEffect(() => {
    getYearByMonths().then((response) => {
      setData(response);
      setIsLoading(false);
    })
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-7 border flex flex-col gap-8 w-full max-w-[480px]">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Data Collection by Months</p>
        <p>January - December {data?.year}</p>
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="text-center text-xs text-gray-500 grid place-items-center h-full pb-8">
            Loading data...
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
