"use client";

import { useRouter } from "next/navigation";
import OcrForm from "@/components/forms/ocr";
import { ActionType } from "@/types/plant";
import AiDetectionForm from "@/components/forms/ai-detection";
import { ChevronLeftIcon, ScanText, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddNewPlantPage() {
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
        <h2>Add New Plant</h2>
      </div>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5 items-center">
        <Tabs defaultValue={ActionType.OCR}>
          <TabsList>
            <TabsTrigger value={ActionType.OCR}>
              <ScanText /> Scan with OCR
            </TabsTrigger>
            <TabsTrigger value={ActionType.AI_DETECTION}>
              <Sparkles /> AI Detection
            </TabsTrigger>
          </TabsList>
          <hr className="w-full" />
          <TabsContent value={ActionType.OCR}>
            <OcrForm />
          </TabsContent>
          <TabsContent value={ActionType.AI_DETECTION}>
            <AiDetectionForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
