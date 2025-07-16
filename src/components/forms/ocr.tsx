"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cropper from "../cropper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import States from "@/constants/states.json";
import { DatePicker } from "../ui/datepicker";
import { CSSObjectWithLabel } from "react-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ImageCropper from "../cropper2";
import CropperOld from "../cropper_old";

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

const familyOptions: { label: string; value: string }[] = [
  { label: "Burseraceae", value: "Burseraceae" },
  { label: "Dipterocarpaceae", value: "Dipterocarpaceae" },
];

const genusOptions: { [key: string]: { label: string; value: string }[] } = {
  Burseraceae: [
    { label: "Canarium", value: "canarium" },
    { label: "Dacryodes", value: "dacryodes" },
    { label: "Santiria", value: "santiria" },
    { label: "Triomma", value: "triomma" },
  ],
  Dipterocarpaceae: [
    { label: "Anisoptera", value: "anisoptera" },
    { label: "Dipterocarpus", value: "dipterocarpus" },
    { label: "Hopea", value: "hopea" },
    { label: "Neobalanocarpus", value: "neobalanocarpus" },
    { label: "Parashorea", value: "parashorea" },
    { label: "Richetia", value: "richetia" },
    { label: "Rubroshorea", value: "rubroshorea" },
    { label: "Shorea", value: "shorea" },
    { label: "Vatica", value: "vatica" },
  ],
};

export default function OcrForm() {
  const [image, setImage] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>();
  const [selectedFile, setSelectedFile] = useState<File>();

  const [formValues, setFormValues] = useState({
    family: "",
    genus: "",
    species: "",
    barCode: "",
    prefix: "",
    number: "",
    collector: "",
    date: new Date(),
    state: "",
    district: "",
    location: "",
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

  return (
    <div className="flex w-full gap-4 mb-6">
      <div className="flex-1">
        <Cropper
          handleSetImgSrc={(image) => setImage(image)}
          imgSrc={image}
          previewCanvasRef={previewCanvasRef}
          handleSetSelectedFile={(file) => setSelectedFile(file)}
        />

        {/* <CropperOld
          handleSetImgSrc={(image) => setImage(image)}
          imgSrc={image}
          previewCanvasRef={previewCanvasRef}
          handleSetSelectedFile={(file) => setSelectedFile(file)}
        /> */}

        {/* <ImageCropper
          handleSetImgSrc={(image) => setImage(image)}
          imgSrc={image}
          previewCanvasRef={previewCanvasRef}
          handleSetSelectedFile={(file) => setSelectedFile(file)}
        /> */}
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
              setFormValues({ ...formValues, family: newValue?.value || "" })
            }
            styles={customSelectStyle}
            placeholder="Select a family"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Genus</label>
          <CreatableSelect
            isDisabled={!formValues.family}
            isClearable
            options={genusOptions[formValues.family]}
            onChange={(newValue) =>
              setFormValues({ ...formValues, genus: newValue?.value || "" })
            }
            styles={customSelectStyle}
            placeholder="Select a genus"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Species</label>
          <Input name="species" onChange={onInputChange} />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Barcode</label>
          <Input name="barCode" onChange={onInputChange} />
        </div>
        <div className="flex gap-3 w-full">
          <div className="flex flex-col gap-1 w-full">
            <label>Prefix</label>
            <Input name="prefix" onChange={onInputChange} />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label>Number</label>
            <Input name="number" onChange={onInputChange} />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Collector</label>
          <Input name="collector" onChange={onInputChange} />
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
          <Select
            value={formValues.state}
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
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>District</label>
          <Input name="district" onChange={onInputChange} />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Location</label>
          <Input name="location" onChange={onInputChange} />
        </div>
        <Button
          type="submit"
          disabled={Object.values(formValues).some((value) => !value)}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
