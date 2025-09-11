"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import OcrForm from "@/components/forms/ocr";
import { ChevronLeftIcon } from "lucide-react";
import { ActionType, Plant } from "@/types/plant";
import AiDetectionForm from "@/components/forms/ai-detection";
import { getPlantById, getPlantImage } from "@/services/plantServices";

export default function UpdatePlantPage() {
  const params = useParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPlantById({ id: params.id?.toString() || "" })
      .then((data) => {
        getPlantImage({ id: params.id?.toString() || "" }).then(
          ({ imageUrl }) => {
            setPlant({
              ...data,
              imagePath: imageUrl || "",
            });
            setIsLoading(false);
          }
        );
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

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {plant?.actionType === ActionType.OCR ? (
              <OcrForm update initialValues={plant} />
            ) : (
              <AiDetectionForm update initialValues={plant} />
            )}
          </>
        )}
      </div>
    </>
  );
}
