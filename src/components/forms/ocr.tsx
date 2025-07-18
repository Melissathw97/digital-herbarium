"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cropper from "../cropper";
import { Input } from "../ui/input";
import { Info } from "lucide-react";
import { Button } from "../ui/button";
import ScanButton from "../scanButton";
import { Plant } from "@/types/plant";
import States from "@/constants/states.json";
import { DatePicker } from "../ui/datepicker";
import { FormValues, Option } from "@/types/form";
import { CSSObjectWithLabel } from "react-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  const [image, setImage] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();

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
    console.log("formValues", formValues);
  };

  useEffect(() => {
    if (update && initialValues) {
      const family: Option = familyOptions.find(
        (fam) => fam.value === initialValues.family
      ) || { label: "", value: "" };
      const state =
        States.states.find((state) => state.value === initialValues.state)
          ?.value || "";

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
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <>
      <div className="flex items-center gap-2 text-center bg-blue-50 p-2 px-4 text-blue-500 rounded-sm mb-5">
        <Info className="w-4" />
        Upload an unflipped image and crop the section you wish to scan using
        OCR.
      </div>
      <div className="flex w-full gap-4 mb-6">
        <div className="flex-1">
          <Cropper
            handleSetImgSrc={(image) => setImage(image)}
            imgSrc={image}
            previewCanvasRef={previewCanvasRef}
            handleSetSelectedFile={(file) => setSelectedFile(file)}
          />
        </div>
        <form
          onSubmit={onFormSubmit}
          className="bg-white border rounded-sm h-full flex-1 p-4 shadow-sm flex flex-col gap-5 items-end"
        >
          <div className="flex flex-col gap-2 w-full">
            <label>Family</label>

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
            <label>Species</label>

            <div className="flex gap-2">
              <Input
                name="species"
                value={formValues.species}
                onChange={onInputChange}
              />

              <ScanButton
                previewCanvasRef={previewCanvasRef}
                onSubmit={(value) =>
                  setFormValues({ ...formValues, species: value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label>Barcode</label>

            <div className="flex gap-2">
              <Input
                name="barcode"
                value={formValues.barcode}
                onChange={onInputChange}
              />

              <ScanButton
                isBarcode
                previewCanvasRef={previewCanvasRef}
                onSubmit={(value) =>
                  setFormValues({ ...formValues, barcode: value })
                }
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
          <div className="flex flex-col gap-1 w-full">
            <label>Vernacular Name</label>
            <Input
              name="vernacularName"
              value={formValues.vernacularName}
              onChange={onInputChange}
            />
          </div>
          <Button
            type="submit"
            disabled={Object.values(formValues).some((value) => !value)}
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}
