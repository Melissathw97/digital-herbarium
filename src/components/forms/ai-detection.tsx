"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Alert from "../alert";
import Image from "next/image";
import { toast } from "sonner";
import Spinner from "../spinner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pages } from "@/types/pages";
import { Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import States from "@/constants/states.json";
import ImageUploader from "../imageUploader";
import { DatePicker } from "../ui/datepicker";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { postAiDetection, postImageToBase64 } from "@/services/aiServices";
import { ActionType, Plant, PlantAiDetectionPayload } from "@/types/plant";
import {
  postPlantAiDetection,
  updatePlant,
  updatePlantImage,
} from "@/services/plantServices";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
    image: undefined,
    family: "",
    species: "",
    confidenceLevel: 0,
  });
  const [formValues, setFormValues] = useState({
    vernacularName: "",
    barcode: "",
    prefix: "",
    number: "",
    collector: "",
    date: new Date(),
    state: "",
    district: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSelectFile = (files: File[]) => {
    if (files?.length) {
      setData({ ...data, image: files[0] });
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

  const capitalizeFirstLetter = (string: string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  };

  const onBeginDetectionClick = () => {
    setIsLoading(true);

    if (data.image)
      postImageToBase64({ image: data.image })
        .then((resp) => {
          const { base64 } = resp;

          postAiDetection({
            image: base64.replace("data:image/jpeg;base64,", ""),
          })
            .then((response) => {
              const { family, species, confidence } = response.final_result;

              setData({
                ...data,
                family: capitalizeFirstLetter(family),
                species: capitalizeFirstLetter(
                  species.replace(family, "").trim()
                ),
                confidenceLevel: confidence,
              });
              setIsLoading(false);
              setIsComplete(true);
            })
            .catch((error) => {
              toast.error(error);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          toast.error(error);
        });
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onSubmitClick = () => {
    setIsSubmitting(true);

    postPlantAiDetection(data)
      .then((data) => {
        toast.success("Plant created successfully");
        router.push(`${Pages.PLANTS}/${data.id}`);
      })
      .catch((error) => {
        toast.error(error);
        setIsSubmitting(false);
      });
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Update Plant Details
    updatePlant({
      ...formValues,
      id: initialValues?.id || "",
      actionType: ActionType.AI_DETECTION,
      family: data.family,
      species: data.species,
      confidenceLevel: data.confidenceLevel,
    })
      .then(() => {
        // Update Plant Image
        updatePlantImage({
          id: initialValues?.id || "",
          image: data.image,
        }).then((response) => {
          toast.success("Plant updated succesfully");
          router.push(`${Pages.PLANTS}/${response.id}`);
        });
      })
      .catch(() => {
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
      setFormValues({
        vernacularName: initialValues.vernacularName || "",
        barcode: initialValues.barcode || "",
        prefix: initialValues.prefix || "",
        number: initialValues.number || "",
        collector: initialValues.collector || "",
        date: initialValues.date ? new Date(initialValues.date) : new Date(),
        state: initialValues.state,
        district: initialValues.district || "",
        location: initialValues.location || "",
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
              <div className="bg-gray-100 rounded-sm">
                <Image
                  alt={data.species}
                  src={image}
                  width={500}
                  height={200}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <ImageUploader handleFiles={onSelectFile} />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div
            className={`${update ? "" : "sticky top-[80px]"} border shadow-sm rounded-sm`}
          >
            {isLoading ? (
              <div className="flex flex-col gap-4 items-center p-12">
                <p className="text-gray-600 text-center">
                  Detecting plant species...
                </p>
                <Spinner />
              </div>
            ) : isComplete ? (
              <div className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs text-gray-500 uppercase">
                    Confidence Level
                  </p>
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[140px]"
                  >
                    <RadialBarChart
                      data={chartData}
                      startAngle={90}
                      endAngle={90 - 360 * data.confidenceLevel}
                      innerRadius={63}
                      outerRadius={90}
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[68, 57]}
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
                                    {Math.round(data.confidenceLevel * 100)}%
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </PolarRadiusAxis>
                    </RadialBarChart>
                  </ChartContainer>
                  <div className="grid grid-cols-[80px_auto] mt-2 gap-y-1 font-semibold">
                    <p className="text-lime-700">Family:</p>
                    <span>{data.family}</span>
                    <p className="text-lime-700">Species:</p>
                    <em>{data.species}</em>
                  </div>
                </div>
                {!update && (
                  <Button
                    className="w-full mt-8"
                    onClick={onSubmitClick}
                    disabled={isSubmitting}
                  >
                    Submit Results
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center p-12">
                <p className="text-gray-600 text-center">
                  {image
                    ? "When you're ready, click on the button below to begin AI detection to identify the plant species."
                    : "Upload an image to begin AI detection"}
                </p>
                <Button disabled={!image} onClick={onBeginDetectionClick}>
                  <Sparkles /> Begin Detection
                </Button>
              </div>
            )}
          </div>

          {update && (
            <form
              onSubmit={onFormSubmit}
              className={`border shadow-sm rounded-sm p-6 flex flex-col gap-4`}
            >
              <div className="flex flex-col gap-1 w-full">
                <label>Vernacular Name</label>
                <Input
                  name="vernacularName"
                  value={formValues.vernacularName}
                  onChange={onInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>Barcode</label>

                <div className="flex gap-2">
                  <Input
                    name="barcode"
                    value={formValues.barcode}
                    onChange={onInputChange}
                  />
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <label>Prefix</label>
                  <Input
                    name="prefix"
                    value={formValues.prefix}
                    onChange={onInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label>Number</label>
                  <Input
                    name="number"
                    value={formValues.number}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label>Collector</label>
                <Input
                  name="collector"
                  value={formValues.collector}
                  onChange={onInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>Date</label>
                <DatePicker
                  date={formValues.date}
                  setDate={(date) => setFormValues({ ...formValues, date })}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>State</label>
                {(!update || !initialValues?.state || formValues.state) && (
                  <Select
                    value={formValues.state ?? ""}
                    onValueChange={(value) =>
                      setFormValues({ ...formValues, state: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {States.states.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>District</label>
                <Input
                  name="district"
                  value={formValues.district}
                  onChange={onInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>Location</label>
                <Input
                  name="location"
                  value={formValues.location}
                  onChange={onInputChange}
                />
              </div>

              <Button
                type="submit"
                className="ml-auto"
                disabled={
                  !image ||
                  !isComplete ||
                  isSubmitting ||
                  Object.values(formValues).some((value) => !value)
                }
              >
                Submit
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
