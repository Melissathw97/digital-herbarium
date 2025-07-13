"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/datepicker";
import States from "@/constants/states.json";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ImageUploader from "../imageUploader";

export default function OcrForm() {
  const [formValues, setFormValues] = useState({
    family: "",
    species: "",
    barCode: "",
    prefix: "",
    number: "",
    collector: "",
    date: "",
    state: "",
    district: "",
    location: "",
  });

  const onFamilyClick = (family: string) => {
    setFormValues({
      ...formValues,
      family,
    });
  };

  return (
    <div className="flex w-full gap-4 mb-6">
      <div className="flex-1">
        <ImageUploader />
      </div>
      <div className="bg-white border rounded-sm h-full flex-1 p-4 shadow-sm flex flex-col gap-5 items-end">
        <div className="flex flex-col gap-2 w-full">
          <label>Family</label>
          <div className="flex gap-2">
            {["Burseraceae", "Dipterocarpaceae"].map((family) => (
              <Button
                key={family}
                variant={family === formValues.family ? "secondary" : "outline"}
                size="sm"
                onClick={() => onFamilyClick(family)}
              >
                {family}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Genus</label>
          <Input name="genus" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Species</label>
          <Input name="species" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Barcode</label>
          <Input name="barCode" type="number" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Prefix</label>
          <Input name="prefix" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Number</label>
          <Input name="number" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Collector</label>
          <Input name="collector" />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Date</label>
          <DatePicker />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>State</label>
          <Select>
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
          <Input name="district" />
        </div>
        <Button
          type="submit"
          disabled={Object.values(formValues).some((value) => !value)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
