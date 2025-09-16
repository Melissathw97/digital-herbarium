"use client";

import _ from "lodash";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";
import { ChartDataWithColor } from "@/types/chart";
import { UserActivitySummary } from "@/types/user";
import { usePathname, useSearchParams } from "next/navigation";
import { addLimeColors, generateChartConfig } from "@/utils/chartUtils";
import {
  getUserProfile,
  getUserActivitySummary,
} from "@/services/userServices";

export default function UserContributionChart() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get("profileId");

  const [isLoading, setIsLoading] = useState(true);
  const [topFamily, setTopFamily] = useState("");
  const [totalHerbarium, setTotalHerbarium] = useState(0);
  const [data, setData] = useState<ChartDataWithColor[]>();
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    number: { label: "Number" },
  });

  const convertToChartData = (response: UserActivitySummary) =>
    _(response.data)
      .map((order: UserActivitySummary["data"][0]) => ({
        type: order.familyName,
        number: order.totalHerbarium,
      }))
      .orderBy("number", "desc")
      .value();

  const fetchData = async () => {
    try {
      let profileData = null;

      if (pathname.includes("profile")) {
        profileData = await getUserProfile();
      }

      setIsLoading(true);

      if (profileData?.profileId || profileIdParam) {
        const response = await getUserActivitySummary(
          (profileData?.profileId ?? profileIdParam) as string
        );
        setTotalHerbarium(response.totalHerbarium);
        setTopFamily(response.topFamily);

        const rawChartData = addLimeColors(convertToChartData(response));
        setData(rawChartData);

        const dynamicConfig = generateChartConfig(rawChartData);
        setChartConfig(dynamicConfig);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-5 border flex flex-col gap-3 w-full shrink-0 md:w-[280px]">
      <div className="flex flex-col gap-1.5">
        <p className="font-semibold">Contribution Insights</p>
        <p className="text-xs text-gray-600">
          Leading family: <b>{topFamily || "-"}</b>
        </p>
      </div>
      <div className="flex-1 pb-0">
        {isLoading ? (
          <div className="text-center text-xs text-gray-500 grid place-items-center h-full py-20">
            Loading data...
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center text-xs text-gray-500 grid place-items-center h-full py-20">
            No data found
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="number"
                nameKey="type"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalHerbarium.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Records
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </div>
      <div className="flex flex-col text-right text-[10px]">
        <p className="font-medium">Last updated:</p>
        <div className="text-muted-foreground">
          {new Date().toLocaleString("en-MY", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
