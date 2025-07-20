"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import Image from "next/image";
import Spinner from "../spinner";
import { Button } from "../ui/button";
import { Pages } from "@/types/pages";
import { Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUploader from "../imageUploader";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { Plant, PlantAiDetectionPayload } from "@/types/plant";
import { postPlantAiDetection } from "@/services/plantServices";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartData = [
  { browser: "confidence", confidence: 80, fill: "var(--color-confidence)" },
];

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "var(--chart-12)",
  },
} satisfies ChartConfig;

export default function AiDetectionForm({
  update = false,
  initialValues,
}: {
  update?: boolean;
  initialValues?: Plant;
}) {
  const router = useRouter();

  const [image, setImage] = useState("");
  const [data, setData] = useState<PlantAiDetectionPayload>({
    family: "",
    species: "",
    confidenceLevel: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSelectFile = (files: File[]) => {
    if (files?.length) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImage(reader.result?.toString() || "")
      );
      reader.readAsDataURL(files[0]);
    }
  };

  const resetImage = () => {
    setImage("");
    setIsComplete(false);
  };

  const onBeginDetectionClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsComplete(true);
      setIsLoading(false);
    }, 2000);
  };

  const onSubmitClick = () => {
    setIsSubmitting(true);

    postPlantAiDetection(data)
      .then((data) => {
        router.push(`${Pages.PLANTS}/${data.id}`);
      })
      .catch((error) => {
        alert(error);
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (update && initialValues) {
      setIsComplete(true);
      setImage(initialValues.imagePath);
      setData({
        family: initialValues.family,
        species: initialValues.species,
        confidenceLevel: initialValues.confidenceLevel,
      });
    } else {
      setIsExpanded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <>
      <Alert
        title="How does it work?"
        expand
        isExpanded={isExpanded}
        toggleExpand={() => setIsExpanded(!isExpanded)}
      >
        <ol className="text-xs list-decimal ml-4 mt-1 leading-5">
          <li>
            Upload a flipped image, ensuring the leaves are visible and not
            blocked by notes
          </li>
          <li>Begin detection to identify the plant species</li>
          <li>Submit the AI detection result</li>
        </ol>
      </Alert>
      <div className="flex gap-4">
        <div className="flex-1 min-h-[250px] max-w-[50%] flex flex-col gap-4">
          {image ? (
            <>
              <div className="flex border rounded-sm p-0.5 justify-between">
                <Button variant="ghost" onClick={resetImage}>
                  <X />
                </Button>
              </div>
              <div className="bg-gray-100 rounded-sm h-full">
                <Image
                  alt={data.species}
                  src={image}
                  width={500}
                  height={200}
                />
              </div>
            </>
          ) : (
            <ImageUploader handleFiles={onSelectFile} />
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
                  <Spinner />
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
                        endAngle={90 - 360 * data.confidenceLevel}
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
                          dataKey="confidence"
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
                                      {data.confidenceLevel * 100}%
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          />
                        </PolarRadiusAxis>
                      </RadialBarChart>
                    </ChartContainer>
                    <div className="grid grid-cols-[100px_auto] mt-4 gap-y-1 font-semibold">
                      <p className="text-lime-700">Family:</p>
                      <span>{data.family}</span>
                      <p className="text-lime-700">Species:</p>
                      <em>{data.species}</em>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={onSubmitClick}
                    disabled={isSubmitting}
                  >
                    {update ? "Update Results" : "Submit Results"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 items-center p-12">
                  <p className="text-gray-600 text-center">
                    When you're ready, click on the button below to begin AI
                    detection to identify the plant species.
                  </p>
                  <Button disabled={isComplete} onClick={onBeginDetectionClick}>
                    <Sparkles />{" "}
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
