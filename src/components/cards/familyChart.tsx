"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a legend";

const chartData = [
  { family: "burseraceae", count: 275, fill: "var(--color-burseraceae)" },
  {
    family: "dipterocarpaceae",
    count: 200,
    fill: "var(--color-dipterocarpaceae)",
  },
  { family: "meliaceae", count: 187, fill: "var(--color-meliaceae)" },
  { family: "sapindaceae", count: 173, fill: "var(--color-sapindaceae)" },
  { family: "cistaceae", count: 90, fill: "var(--color-cistaceae)" },
];

const chartConfig = {
  count: {
    label: "Count",
  },
  burseraceae: {
    label: "Burseraceae",
    color: "var(--chart-1)",
  },
  dipterocarpaceae: {
    label: "Dipterocarpaceae",
    color: "var(--chart-2)",
  },
  meliaceae: {
    label: "Meliaceae",
    color: "var(--chart-3)",
  },
  sapindaceae: {
    label: "Sapindaceae",
    color: "var(--chart-4)",
  },
  cistaceae: {
    label: "Cistaceae",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export default function FamilyChart() {
  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-7 border flex flex-col flex-1 gap-3 min-w-[300px]">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Top 5 Families</p>
      </div>
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full w-full"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="family" hideLabel />}
            />
            <Pie data={chartData} dataKey="count" />
            <ChartLegend
              content={<ChartLegendContent nameKey="family" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
