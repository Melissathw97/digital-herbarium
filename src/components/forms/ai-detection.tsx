"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import ImageUploader from "../imageUploader";
import { ChartConfig, ChartContainer } from "../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartData = [
  { browser: "safari", visitors: 80, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-12)",
  },
} satisfies ChartConfig;

export default function AiDetectionForm() {
  const [isComplete, setIsComplete] = useState(true);

  return (
    <div>
      <div className="flex flex-col w-full gap-6 items-end justify-center mb-12 max-w-lg mx-auto">
        <div className="flex flex-col gap-2 w-full">
          <label>Upload an image</label>
          {isComplete ? (
            <Image
              alt="Sample"
              src="/herbarium-background.png"
              width={550}
              height={200}
            />
          ) : (
            <ImageUploader disabled={isComplete} />
          )}
        </div>

        <Button disabled={isComplete}>
          {isComplete ? "Detection Complete!" : "Begin Detection"}
        </Button>
      </div>
      {isComplete ? (
        <div className="w-full border shadow-sm max-w-sm mx-auto rounded-sm pt-12 pb-6 px-6 mb-6">
          <div className="flex flex-col items-center gap-4 mb-12">
            <p className="text-xs text-gray-500 uppercase">Confidence Level</p>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[160px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={-220}
                innerRadius={70}
                outerRadius={100}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[76, 64]}
                />
                <RadialBar dataKey="visitors" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                              className="fill-foreground text-4xl font-bold"
                            >
                              86%
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
            <div className="grid grid-cols-[100px_auto] mt-4 gap-y-1">
              <p className="text-gray-500">Family:</p>
              <span className="text-lime-700 font-bold">Burseraceae</span>
              <p className="text-gray-500">Genus:</p>
              <span className="text-lime-700 font-bold">Santiria</span>
              <p className="text-gray-500">Species:</p>
              <span className="text-lime-700 font-bold">
                Santiria Apiculata
              </span>
            </div>
          </div>
          <Button className="w-full">Submit Data</Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
