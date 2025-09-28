"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Alert from "../alert";
import Image from "next/image";
import { toast } from "sonner";
import Spinner from "../spinner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pages } from "@/types/pages";
import States from "@/constants/states.json";
import { DatePicker } from "../ui/datepicker";
import { useAuth } from "@/utils/supabase/tokenStorage";
import { usePathname, useRouter } from "next/navigation";
import { AiFormValues, Option, PlantAiData } from "@/types/form";
import { Locate, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { ActionType, AiResult, Plant, Status } from "@/types/plant";
import { postAiDetection, postImageToBase64 } from "@/services/aiServices";
import {
  patchApprovePlant,
  patchRejectPlant,
  postPlantAiDetection,
  updatePlant,
  updatePlantImage,
} from "@/services/plantServices";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ScanButton from "../scanButton";
import AiResultCard from "../cards/aiResult";
import PlantRejectModal from "../modals/plantReject";
import FamilySelectField from "../familySelectField";
import Cropper from "../cropper";

export default function AiDetectionForm({
  update = false,
  initialValues,
}: {
  update?: boolean;
  initialValues?: Plant;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMember } = useAuth();

  const [image, setImage] = useState("");
  const [aiResult, setAiResult] = useState<AiResult[]>([]);
  const [data, setData] = useState<PlantAiData>({
    image: undefined,
    family: { label: "", value: "" },
    species: "",
    confidenceLevel: 0,
  });
  const [formValues, setFormValues] = useState<AiFormValues>({
    vernacularName: "",
    barcode: "",
    prefix: "",
    number: "",
    collector: "",
    date: new Date(),
    state: "",
    district: "",
    location: "",
    elevation: "",
    latitude: "",
    longitude: "",
    additionalNotes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Crop & OCR
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const onSelectFile = (file?: File) => {
    if (file) {
      setData({ ...data, image: file });
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImage(reader.result?.toString() || "")
      );
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImage("");
    setShowCropper(false);
    setIsComplete(false);
  };

  const handleCroppedImageReady = (blob: Blob | null) => {
    setCroppedImage(blob);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.substring(0, 1).toUpperCase() + string.substring(1);
  };

  const resetDetection = () => {
    setIsComplete(false);
    setIsLoading(false);
    // Keep the image and cropped data, just reset the results, to cater for detect again
    setData({
      ...data,
      family: { label: "", value: "" },
      species: "",
      confidenceLevel: 0,
    });
  };

  const onBeginDetectionClick = () => {
    setIsLoading(true);

    if (data.image) {
      if (croppedImage) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;

          // Send to AI detection
          postAiDetection({
            image: base64.replace(/^data:image\/[a-z]+;base64,/, ""),
          })
            .then((response) => {
              const results = response.final_result.map((result) => ({
                family: capitalizeFirstLetter(result.family),
                species: capitalizeFirstLetter(
                  result.species.replace(result.family, "").trim()
                ),
                confidenceLevel: result.confidence,
              }));

              if (results.length > 0) {
                const bestResult = results.reduce(
                  (max: AiResult, current: AiResult) =>
                    current.confidenceLevel > max.confidenceLevel
                      ? current
                      : max
                );

                setData({
                  ...data,
                  family: {
                    label: bestResult.family,
                    value: bestResult.family,
                  },
                  species: bestResult.species,
                  confidenceLevel: bestResult.confidenceLevel,
                });
              }

              setAiResult(results);
              setIsLoading(false);
              setIsComplete(true);
            })
            .catch(() => {
              toast.error(
                "AI detection failed. Please ensure the image is correct."
              );
              setIsLoading(false);
            });
        };
        reader.onerror = (error) => {
          toast.error(`Error processing cropped image: ${error}`);
          setIsLoading(false);
        };
        reader.readAsDataURL(croppedImage);
      } else {
        postImageToBase64({ image: data.image })
          .then((resp) => {
            const { base64 } = resp;

            postAiDetection({
              image: base64.replace("data:image/jpeg;base64,", ""),
            })
              .then((response) => {
                const results = response.final_result.map((result) => ({
                  family: capitalizeFirstLetter(result.family),
                  species: capitalizeFirstLetter(
                    result.species.replace(result.family, "").trim()
                  ),
                  confidenceLevel: result.confidence,
                }));

                if (results.length > 0) {
                  const bestResult = results.reduce(
                    (max: AiResult, current: AiResult) =>
                      current.confidenceLevel > max.confidenceLevel
                        ? current
                        : max
                  );

                  setData({
                    ...data,
                    family: {
                      label: bestResult.family,
                      value: bestResult.family,
                    },
                    species: bestResult.species,
                    confidenceLevel: bestResult.confidenceLevel,
                  });
                }

                setAiResult(results);
                setIsLoading(false);
                setIsComplete(true);
              })
              .catch(() => {
                toast.error(
                  "AI detection failed. Please ensure the image is correct."
                );
                setIsLoading(false);
              });
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    }
  };

  const onDataInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const getCoordinates = () => {
    const successCallback = (position: GeolocationPosition) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setFormValues({
        ...formValues,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.warn(`ERROR(${error.code}): ${error.message}`);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000, // 5 seconds
      maximumAge: 0, // No cached position
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!update) {
      const selectedResult = aiResult.find((result) => {
        return (
          result.family === data.family.value && result.species === data.species
        );
      });

      postPlantAiDetection({
        ...formValues,
        image: data.image,
        family: data.family.value,
        species: data.species,
        ...(selectedResult
          ? { confidenceLevel: selectedResult.confidenceLevel }
          : {}),
      })
        .then((data) => {
          toast.success("Plant created successfully");
          router.replace(`${Pages.PLANTS}/${data.id}`);
        })
        .catch((error) => {
          toast.error(error);
          setIsSubmitting(false);
        });
    } else {
      // Update Plant Details
      updatePlantImage({
        id: initialValues?.id || "",
        image: data.image,
      })
        .then(() => {
          updatePlant({
            ...formValues,
            id: initialValues?.id || "",
            actionType: ActionType.AI_DETECTION,
            family: data.family.value,
            species: data.species,
            confidenceLevel: data.confidenceLevel,
          })
            .then((plant) => {
              // Update Plant Image
              toast.success("Plant updated succesfully");
              router.replace(`${Pages.PLANTS}/${plant.id}`);
            })
            .catch((error) => {
              toast.error(error);
              setIsSubmitting(false);
            });
        })
        .catch((error) => {
          toast.error(error);
          setIsSubmitting(false);
        });
    }
  };

  const approvePlant = () => {
    setIsSubmitting(true);

    updatePlant({
      ...formValues,
      id: initialValues?.id || "",
      actionType: ActionType.AI_DETECTION,
      family: data.family.value,
      species: data.species,
      confidenceLevel: data.confidenceLevel,
    })
      .then(() => {
        updatePlantImage({
          id: initialValues?.id || "",
          image: data.image,
        })
          .then(() => {
            patchApprovePlant({ id: initialValues?.id || "" }).then(() => {
              toast.success("Plant approved successfully");
              router.push(Pages.APPROVALS);
            });
          })
          .catch((error) => {
            toast.error(error);
            setIsSubmitting(false);
          });
      })
      .catch((error) => {
        toast.error(error);
        setIsSubmitting(false);
      });
  };

  const rejectPlant = (remarks: string) => {
    setIsSubmitting(true);

    updatePlant({
      ...formValues,
      id: initialValues?.id || "",
      actionType: ActionType.AI_DETECTION,
      family: data.family.value,
      species: data.species,
      confidenceLevel: data.confidenceLevel,
    })
      .then(() => {
        updatePlantImage({
          id: initialValues?.id || "",
          image: data.image,
        })
          .then(() => {
            patchRejectPlant({ id: initialValues?.id || "", remarks }).then(
              () => {
                toast.success("Plant rejected successfully");
                router.push(Pages.APPROVALS);
              }
            );
          })
          .catch((error) => {
            toast.error(error);
            setIsSubmitting(false);
          });
      })
      .catch((error) => {
        toast.error(error);
        setIsSubmitting(false);
      });
  };

  const isSubmitButtonDisabled = useMemo(() => {
    return !image || !isComplete || isSubmitting;
  }, [image, isComplete, isSubmitting]);

  useEffect(() => {
    if (update && initialValues) {
      setIsComplete(true);
      setImage(initialValues.imagePath);
      setData({
        family: {
          label: initialValues.family,
          value: initialValues.family,
        },
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
        elevation: (initialValues.elevation || "").toString(),
        latitude: (initialValues.latitude || "").toString(),
        longitude: (initialValues.longitude || "").toString(),
        additionalNotes: initialValues.additionalNotes || "",
      });
    } else {
      setIsExpanded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <>
      {initialValues && initialValues.status === Status.REJECTED ? (
        <Alert variant="danger" title="Plant has been rejected">
          <p className="text-xs mt-1">Reason: {initialValues.remarks}</p>
        </Alert>
      ) : (
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
            <li>
              <strong>Optional:</strong> Use{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                Show Cropper
              </code>{" "}
              to focus on the plant for better accuracy
            </li>
            <li>Begin detection to identify the plant species</li>
            <li>Select the most accurate result from the detection</li>
            <li>
              Should the AI detection result require modification, you may edit
              the values in the fields below
            </li>
          </ol>
        </Alert>
      )}
      <div className="w-full flex gap-4">
        <div className="flex-1 min-h-[250px] max-w-[50%] flex flex-col gap-4">
          {!image || showCropper ? (
            <Cropper
              handleSetImgSrc={(image) => {
                if (image === "") resetImage();
                else setImage(image);
              }}
              imgSrc={image}
              handleSetSelectedFile={onSelectFile}
              onCroppedImageReady={handleCroppedImageReady}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCropper(!showCropper);
                  setCroppedImage(null);
                }}
                className="text-xs"
                disabled={isLoading}
              >
                Hide Cropper
              </Button>
            </Cropper>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCropper(!showCropper)}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Show Cropper
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetImage}
                  className="flex items-center gap-2 whitespace-nowrap"
                  title="Remove current image"
                >
                  <Trash2 /> Remove Image
                </Button>
              </div>

              <div className="bg-gray-200 rounded-md w-full">
                <Image
                  alt={data.species}
                  src={image}
                  width={500}
                  height={500}
                  className="h-[500px] object-contain"
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {update && !initialValues?.confidenceLevel ? null : (
            <div className="border shadow-sm rounded-sm">
              {isLoading ? (
                <div className="flex flex-col gap-4 items-center p-12">
                  <p className="text-gray-600 text-center">
                    Detecting plant species...
                  </p>
                  <Spinner />
                </div>
              ) : isComplete ? (
                <div className="p-6">
                  <h2 className="text-sm font-bold text-gray-700 mb-4">
                    {update ? (
                      <>DETECTION RESULT</>
                    ) : (
                      <>
                        DETECTION RESULTS{" "}
                        <span className="font-normal text-gray-500">
                          (choose the best match)
                        </span>
                      </>
                    )}
                  </h2>
                  {update ? (
                    <AiResultCard
                      result={{
                        family: initialValues?.family ?? "-",
                        species: initialValues?.species ?? "-",
                        confidenceLevel: initialValues?.confidenceLevel ?? 0,
                      }}
                      isSelected={true}
                    />
                  ) : aiResult.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-5">
                      {aiResult.map((result) => (
                        <AiResultCard
                          key={`${result.family} ${result.species} ${result.confidence}`}
                          result={result}
                          isSelected={
                            result.family === data.family.value &&
                            result.species === data.species &&
                            result.confidenceLevel === data.confidenceLevel
                          }
                          onSelect={() =>
                            setData({
                              ...data,
                              family: {
                                label: result.family,
                                value: result.family,
                              },
                              species: result.species,
                              confidenceLevel: result.confidenceLevel,
                            })
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full py-6 text-center">
                      <p className="text-gray-500 font-medium">
                        No detection results found.
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Please fill in the form manually or try using OCR.
                      </p>
                    </div>
                  )}

                  {/* Action buttons section */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetDetection}
                      disabled={isSubmitting}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Detect Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 items-center p-12">
                  <p className="text-gray-800 text-center">
                    {image
                      ? "When you're ready, click on the button below to begin AI detection to identify the plant species."
                      : "Upload an image to begin AI detection"}
                  </p>
                  {image && (
                    <Alert
                      variant="warning"
                      title="Optimized for Dipterocarpaceae and Burseraceae families
                    at the moment."
                    ></Alert>
                  )}
                  <Button disabled={!image} onClick={onBeginDetectionClick}>
                    <Sparkles /> Begin Detection
                  </Button>
                </div>
              )}
            </div>
          )}

          {(isComplete || update) && (
            <form
              onSubmit={onFormSubmit}
              className={`border shadow-sm rounded-sm p-6 flex flex-col gap-4 items-end`}
            >
              <FamilySelectField
                family={data.family}
                setValue={(val) => setData({ ...data, family: val as Option })}
              />

              <div className="flex flex-col gap-1 w-full">
                <label>
                  Species
                  <span className="text-red-600 ml-0.5">*</span>
                </label>

                <div className="flex gap-2">
                  <Input
                    name="species"
                    value={data.species}
                    onChange={onDataInputChange}
                  />

                  {showCropper && (
                    <ScanButton
                      croppedImage={croppedImage}
                      onSubmit={(value) => setData({ ...data, species: value })}
                    />
                  )}
                </div>
              </div>

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

                  {showCropper && (
                    <ScanButton
                      isBarcode
                      croppedImage={croppedImage}
                      onSubmit={(value) =>
                        setFormValues({ ...formValues, barcode: value })
                      }
                    />
                  )}
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
                <label>
                  State
                  <span className="text-red-600 ml-0.5">*</span>
                </label>
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
                <label>
                  District
                  <span className="text-red-600 ml-0.5">*</span>
                </label>
                <Input
                  name="district"
                  value={formValues.district}
                  onChange={onInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>
                  Location
                  <span className="text-red-600 ml-0.5">*</span>
                </label>
                <Input
                  name="location"
                  value={formValues.location}
                  onChange={onInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>Elevation</label>
                <Input
                  name="elevation"
                  value={formValues.elevation}
                  onChange={onInputChange}
                />
              </div>
              <div className="flex gap-3 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <label>Latitude</label>
                  <Input
                    name="latitude"
                    value={formValues.latitude}
                    onChange={onInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label>Longitude</label>
                  <Input
                    name="longitude"
                    value={formValues.longitude}
                    onChange={onInputChange}
                  />
                </div>

                <Button
                  type="button"
                  onClick={getCoordinates}
                  className="mt-auto"
                >
                  <Locate />
                </Button>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label>Additional Notes</label>
                <Input
                  name="additionalNotes"
                  value={formValues.additionalNotes}
                  onChange={onInputChange}
                />
              </div>

              {pathname.includes("plants") && (
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={isSubmitButtonDisabled}
                >
                  {isSubmitting ? <Spinner /> : "Submit"}
                </Button>
              )}

              {pathname.includes("approvals") && (
                <>
                  {initialValues?.status === Status.REJECTED && (
                    <Button type="submit" disabled={isSubmitButtonDisabled}>
                      {isSubmitting ? <Spinner /> : "Submit"}
                    </Button>
                  )}

                  {initialValues?.status === Status.PENDING_APPROVAL &&
                    (isMember ? (
                      <p className="italic text-center text-xs text-gray-500 mt-5">
                        This record is pending review from an Expert or Admin of
                        your organization.
                      </p>
                    ) : (
                      initialValues?.status === Status.PENDING_APPROVAL && (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() =>
                              setIsRejectModalOpen(!isRejectModalOpen)
                            }
                            variant="outline_destructive"
                          >
                            Reject
                          </Button>

                          <Button
                            type="button"
                            onClick={approvePlant}
                            disabled={isSubmitButtonDisabled}
                          >
                            Approve
                          </Button>
                        </div>
                      )
                    ))}
                </>
              )}
            </form>
          )}
        </div>

        <PlantRejectModal
          open={isRejectModalOpen}
          toggle={() => setIsRejectModalOpen(!isRejectModalOpen)}
          onReject={rejectPlant}
        />
      </div>
    </>
  );
}
