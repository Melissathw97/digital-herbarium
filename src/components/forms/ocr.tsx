"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import Spinner from "../spinner";
import Cropper from "../cropper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ScanButton from "../scanButton";
import States from "@/constants/states.json";
import { DatePicker } from "../ui/datepicker";
import { FormValues, Option } from "@/types/form";
import { CSSObjectWithLabel } from "react-select";
import { ActionType, Plant } from "@/types/plant";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Alert from "../alert";
import { Pages } from "@/types/pages";
import { useRouter } from "next/navigation";
import {
  postPlantOCR,
  updatePlant,
  updatePlantImage,
} from "@/services/plantServices";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const customSelectStyle = {
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: "0.5rem",
    borderColor: "#e5e5e5",
  }),
};

const familyOptions: Option[] = [
  { label: "Burseraceae", value: "Burseraceae" },
  { label: "Dipterocarpaceae", value: "Dipterocarpaceae" },
];

export default function OcrForm({
  update = false,
  initialValues,
}: {
  update?: boolean;
  initialValues?: Plant;
}) {
  const router = useRouter();

  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [showScanButton, setShowScanButton] = useState(false);

  const previewRef = useRef<HTMLImageElement>(null);

  const [formValues, setFormValues] = useState<FormValues>({
    family: { label: "", value: "" },
    species: "",
    barcode: "",
    prefix: "",
    number: "",
    collector: "",
    date: new Date(),
    state: "",
    district: "",
    location: "",
    vernacularName: "",
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // For create
    if (!update && selectedFile)
      postPlantOCR({
        ...formValues,
        family: formValues.family.value,
        image: selectedFile,
      })
        .then((data) => {
          toast.success("Plant created successfully");
          router.push(`${Pages.PLANTS}/${data.id}`);
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error);
          setIsLoading(false);
        });

    // For update
    if (update)
      updatePlant({
        ...formValues,
        id: initialValues?.id || "",
        actionType: ActionType.OCR,
        family: formValues.family.value,
      })
        .then((data) => {
          updatePlantImage({
            id: initialValues?.id || "",
            image: selectedFile,
          })
            .then(() => {
              toast.success("Plant updated successfully");
              router.push(`${Pages.PLANTS}/${data.id}`);
              setIsLoading(false);
            })
            .catch((error) => {
              toast.error(error);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          toast.error(error);
          setIsLoading(false);
        });
  };

  const isSubmitButtonDisabled = useMemo(() => {
    const requiredFields = ["family", "species"];

    return (
      Object.entries(formValues)
        .filter(([field]) => requiredFields.includes(field))
        .some(([, value]) => {
          if (typeof value === "object") return !value?.value;
          return value === "";
        }) ||
      !image ||
      isLoading
    );
  }, [formValues, image, isLoading]);

  useEffect(() => {
    if (update && initialValues) {
      const family = {
        label: initialValues.family,
        value: initialValues.family,
      };
      const state =
        States.states.find((state) => state.value === initialValues.state)
          ?.value || "";

      if (
        familyOptions.find((fam) => fam.value === family.value) === undefined
      ) {
        familyOptions.push({
          label: initialValues.family,
          value: initialValues.family,
        });
      }

      setImage(initialValues.imagePath);
      setFormValues({
        ...formValues,
        family,
        species: initialValues.species,
        barcode: initialValues.barcode,
        prefix: initialValues.prefix,
        number: initialValues.number,
        collector: initialValues.collector,
        date: new Date(initialValues.date),
        state,
        district: initialValues.district,
        location: initialValues.location,
        vernacularName: initialValues.vernacularName,
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
          <li>Upload an unflipped image</li>
          <li>Crop any part of the image</li>
          <li>
            Scan the text within the cropped image for the Species or Barcode
            fields
          </li>
          <li>Fill in all other plant details</li>
          <li>Submit the form</li>
        </ol>
      </Alert>
      <div className="flex w-full gap-4 mb-6">
        <div className="flex-1 max-w-[50%]">
          <Cropper
            imgSrc={image}
            previewRef={previewRef}
            handleSetImgSrc={(image) => setImage(image)}
            showScanButton={() => setShowScanButton(true)}
            handleSetSelectedFile={(file) => setSelectedFile(file)}
          />
        </div>
        <form
          onSubmit={onFormSubmit}
          className="bg-white border rounded-sm h-full flex-1 p-4 shadow-sm flex flex-col gap-5 items-end"
        >
          <div className="flex flex-col gap-2 w-full">
            <label>
              Family
              <span className="text-red-600 ml-0.5">*</span>
            </label>

            <CreatableSelect
              isClearable
              options={familyOptions}
              onChange={(newValue) =>
                setFormValues({
                  ...formValues,
                  family: newValue as Option,
                })
              }
              value={formValues.family}
              styles={customSelectStyle}
              placeholder="Select a family"
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label>
              Species
              <span className="text-red-600 ml-0.5">*</span>
            </label>

            <div className="flex gap-2">
              <Input
                name="species"
                value={formValues.species}
                onChange={onInputChange}
              />

              {showScanButton && (
                <ScanButton
                  previewRef={previewRef}
                  onSubmit={(value) =>
                    setFormValues({ ...formValues, species: value })
                  }
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

              {showScanButton && (
                <ScanButton
                  isBarcode
                  previewRef={previewRef}
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
            <label>State</label>
            {(!update || formValues.state) && (
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
          <Button type="submit" disabled={isSubmitButtonDisabled}>
            {isLoading ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </div>
    </>
  );
}
