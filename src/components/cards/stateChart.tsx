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
import { State } from "@/types/dashboard";
import { useEffect, useMemo, useState } from "react";
import { getTopStates } from "@/services/dashboardServices";

export default function StateChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<State[]>();

  const chartData = useMemo(() => {
    return data?.map((state) => {
      const stateName = state.name.replace(" ", "-");

      return {
        state: stateName,
        count: state.total,
        fill: `var(--color-${stateName})`,
      };
    });
  }, [data]);

  const chartConfig = useMemo(() => {
    const config = data?.reduce((obj, state, index) => {
      const stateName = state.name.replace(" ", "-");

      if (!obj[stateName]) {
        obj[stateName] = {
          label: state.name,
          color: `var(--chart-${index + 6})`,
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
    getTopStates().then((response) => {
      setData(response.slice(0, 5));
      setTimeout(() => setIsLoading(false), 500);
    });
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-7 border flex flex-col flex-1 gap-3 min-w-[300px]">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">Top 5 States</p>
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
                content={<ChartTooltipContent nameKey="state" hideLabel />}
              />
              <Pie data={chartData} dataKey="count" />
              <ChartLegend
                content={<ChartLegendContent nameKey="state" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
