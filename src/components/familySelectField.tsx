import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Option } from "@/types/form";
import { CSSObjectWithLabel } from "react-select";

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

export default function FamilySelectField({
  family,
  setValue,
}: {
  family: Option;
  setValue: (value: unknown) => void;
}) {
  useEffect(() => {
    if (familyOptions.find((fam) => fam.value === family.value) === undefined) {
      familyOptions.push({
        label: family.value,
        value: family.value,
      });
    }
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <label>
        Family
        <span className="text-red-600 ml-0.5">*</span>
      </label>

      <CreatableSelect
        isClearable
        options={familyOptions}
        onChange={(newValue) => setValue(newValue)}
        value={family}
        styles={customSelectStyle}
        placeholder="Select a family"
        className="w-full"
      />
    </div>
  );
}
