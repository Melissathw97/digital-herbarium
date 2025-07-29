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
import { Family } from "@/types/dashboard";
import { useEffect, useMemo, useState } from "react";
import { getTopFamilies } from "@/services/dashboardServices";

export default function FamilyChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Family[]>();

  const chartData = useMemo(() => {
    return data?.map((family) => ({
      family: family.name,
      count: family.total,
      fill: `var(--color-${family.name})`,
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    const config = data?.reduce((obj, family, index) => {
      if (!obj[family.name]) {
        obj[family.name] = {
          label: family.name,
          color: `var(--chart-${index + 1})`,
        };
      }

      return obj;
    }, {} as ChartConfig);

    return {
      count: {
        label: "Count",
      },
      ...(data ? config : {}),
    };
  }, [data]);

  useEffect(() => {
    getTopFamilies().then((response) => {
      setData(response.slice(0, 5));
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-7 border flex flex-col flex-1 gap-3 min-w-[300px]">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Top 5 Families</p>
      </div>
      <div className="flex-1 pb-0">
        {isLoading ? (
          <div className="text-center text-xs text-gray-500 grid place-items-center h-full pb-8">
            Loading data...
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
