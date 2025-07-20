"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import OcrForm from "@/components/forms/ocr";
import { ActionType, Plant } from "@/types/plant";
import { getPlantById } from "@/services/plantServices";
import AiDetectionForm from "@/components/forms/ai-detection";
import { ChevronLeftIcon, ScanText, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UpdatePlantPage() {
  const params = useParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPlantById({ id: params.id?.toString() || "" })
      .then((data) => {
        setPlant(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [params.id]);

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-200 p-1 rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2>Edit Plant</h2>
      </div>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Tabs defaultValue={plant?.actionType}>
              <TabsList>
                <TabsTrigger value={ActionType.OCR} disabled>
                  <ScanText /> Scan with OCR
                </TabsTrigger>
                <TabsTrigger value={ActionType.AI_DETECTION} disabled>
                  <Sparkles /> AI Detection
                </TabsTrigger>
              </TabsList>
              <hr className="w-full" />
              <TabsContent value={ActionType.OCR}>
                <OcrForm update initialValues={plant} />
              </TabsContent>
              <TabsContent value={ActionType.AI_DETECTION}>
                <AiDetectionForm update initialValues={plant} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </>
  );
}
