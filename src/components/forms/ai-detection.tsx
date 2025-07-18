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
import { Info, LoaderCircle, X } from "lucide-react";

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
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const onSelectFile = (files: File[]) => {
    if (files?.length) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImage(reader.result?.toString() || "")
      );
      reader.readAsDataURL(files[0]);
    }
  };

  const onBeginDetectionClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsComplete(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center gap-2 text-center bg-blue-50 p-2 px-4 text-blue-500 rounded-sm mb-5">
        <Info className="w-4" />
        Upload a flipped image and begin detection, then submit the AI detection
        result.
      </div>
      <div className="flex gap-4">
        <div className="flex-1 min-h-[250px]">
          {image ? (
            <>
              <div className="flex border rounded-sm p-0.5 justify-between mb-4">
                <Button variant="ghost" onClick={() => setImage("")}>
                  <X />
                </Button>
              </div>
              <Image alt="Sample" src={image} width={550} height={200} />
            </>
          ) : (
            <ImageUploader
              accept=".jpg, .jpeg, .png"
              handleFiles={onSelectFile}
            />
          )}
        </div>
        {image ? (
          <div className="flex-1">
            <div className="sticky top-[80px] border shadow-sm rounded-sm">
              {isLoading ? (
                <div className="flex flex-col gap-4 items-center p-12">
                  <p className="text-gray-600 text-center">
                    Detecting plant species...
                  </p>
                  <LoaderCircle className="animate-spin mx-auto" />
                </div>
              ) : isComplete ? (
                <div className="pt-12 pb-6 px-6">
                  <div className="flex flex-col items-center gap-4 mb-12">
                    <p className="text-xs text-gray-500 uppercase">
                      Confidence Level
                    </p>
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
                        <RadialBar
                          dataKey="visitors"
                          background
                          cornerRadius={10}
                        />
                        <PolarRadiusAxis
                          tick={false}
                          tickLine={false}
                          axisLine={false}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
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
                      <span className="text-lime-700 font-bold">
                        Burseraceae
                      </span>
                      <p className="text-gray-500">Species:</p>
                      <span className="text-lime-700 font-bold">
                        Santiria Apiculata
                      </span>
                      <p className="text-gray-500">Vernacular:</p>
                      <span className="text-lime-700 font-bold">Santiria</span>
                    </div>
                  </div>
                  <Button className="w-full">Submit Result</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 items-center p-12">
                  <p className="text-gray-600 text-center">
                    When you're ready, click on the button below to begin AI
                    detection to identify the plant species.
                  </p>
                  <Button disabled={isComplete} onClick={onBeginDetectionClick}>
                    {isComplete ? "Detection Complete!" : "Begin Detection"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
