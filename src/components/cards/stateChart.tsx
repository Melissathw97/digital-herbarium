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
  { family: "selangor", count: 235, fill: "var(--color-selangor)" },
  {
    family: "johor",
    count: 200,
    fill: "var(--color-johor)",
  },
  { family: "pahang", count: 173, fill: "var(--color-pahang)" },
  { family: "kelantan", count: 153, fill: "var(--color-kelantan)" },
  { family: "terengganu", count: 90, fill: "var(--color-terengganu)" },
];

const chartConfig = {
  count: {
    label: "Count",
  },
  selangor: {
    label: "Selangor",
    color: "var(--chart-6)",
  },
  johor: {
    label: "Johor",
    color: "var(--chart-7)",
  },
  pahang: {
    label: "Pahang",
    color: "var(--chart-8)",
  },
  kelantan: {
    label: "Kelantan",
    color: "var(--chart-9)",
  },
  terengganu: {
    label: "Terengganu",
    color: "var(--chart-10)",
  },
} satisfies ChartConfig;

export default function StateChart() {
  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-7 border flex flex-col flex-1 gap-3 min-w-[300px]">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Top 5 States</p>
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
