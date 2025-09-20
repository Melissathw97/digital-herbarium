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
      familyId: family.name.replace(" ", "-").toLowerCase(),
      count: family.total,
      fill: `var(--color-${family.name.replace(" ", "-").toLowerCase()})`,
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    const config = data?.reduce((obj, family, index) => {
      const familyId = family.name.replace(" ", "-").toLowerCase();

      if (!obj[familyId]) {
        obj[familyId] = {
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

  console.log("chartData", chartData);
  console.log("chartConfig", chartConfig);

  useEffect(() => {
    getTopFamilies().then((response) => {
      setData(response.slice(0, 5));
      setTimeout(() => setIsLoading(false), 500);
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
        ) : data?.length === 0 ? (
          <div className="text-center text-xs text-gray-500 grid place-items-center h-full py-8">
            No data found
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-full w-full"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="familyId" hideLabel />}
              />
              <Pie data={chartData} dataKey="count" nameKey="familyId" />
              <ChartLegend
                content={<ChartLegendContent nameKey="familyId" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
