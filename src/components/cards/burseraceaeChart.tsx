import { useMemo, useState } from "react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BurseraceaeChart() {
  const desktopData = useMemo(
    () => [
      { genus: "canarium", value: 8, fill: "var(--color-canarium)" },
      {
        genus: "dacryodes",
        value: 6,
        fill: "var(--color-dacryodes)",
      },
      { genus: "santiria", value: 1, fill: "var(--color-santiria)" },
      { genus: "triomma", value: 2, fill: "var(--color-triomma)" },
    ],
    []
  );

  const [activeGenus, setActiveGenus] = useState(desktopData[0].genus);

  const chartConfig = {
    canarium: {
      label: "Canarium",
      color: "var(--chart-1)",
    },
    dacryodes: {
      label: "Dacryodes",
      color: "var(--chart-2)",
    },
    santiria: {
      label: "Santiria",
      color: "var(--chart-3)",
    },
    triomma: {
      label: "Triomma",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const activeIndex = useMemo(() => {
    const index = desktopData.findIndex((item) => item.genus === activeGenus);
    return index >= 0 ? index : 0;
  }, [desktopData, activeGenus]);

  const genusList = useMemo(
    () => desktopData.map((item) => item.genus),
    [desktopData]
  );

  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-7 border flex flex-col gap-6 min-w-[320px]">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Burseraceae</p>

        <Select value={activeGenus} onValueChange={setActiveGenus}>
          <SelectTrigger size="sm" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {genusList.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `${config.color}`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        id="Burseraceae"
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[280px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={desktopData}
            dataKey="value"
            nameKey="genus"
            innerRadius={60}
            strokeWidth={5}
            activeIndex={activeIndex}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 10} />
                <Sector
                  {...props}
                  outerRadius={outerRadius + 25}
                  innerRadius={outerRadius + 12}
                />
              </g>
            )}
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
                        {activeIndex >= 0 && desktopData[activeIndex]
                          ? desktopData[activeIndex].value.toLocaleString()
                          : "0"}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Plants
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
