"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import AiDetectionForm from "@/components/forms/ai-detection";

export default function AddNewPlantAIPage() {
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
        <h2>Add Plant - AI Detection</h2>
      </div>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col items-center">
        <AiDetectionForm />
      </div>
    </>
  );
}
