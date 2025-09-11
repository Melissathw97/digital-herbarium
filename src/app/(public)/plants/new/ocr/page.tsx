"use client";

import { useRouter } from "next/navigation";
import OcrForm from "@/components/forms/ocr";
import { ChevronLeftIcon } from "lucide-react";

export default function AddNewPlantOCRPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-200 p-1 rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2>Add Plant - Scan with OCR</h2>
      </div>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col items-center">
        <OcrForm />
      </div>
    </>
  );
}
