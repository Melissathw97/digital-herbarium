"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plant } from "@/types/plant";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, LoaderCircle } from "lucide-react";

// TODO: Integrate with Plants API
import mockPlantData from "@/constants/mock_plants.json";

export default function PlantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const plantData = mockPlantData.plants.find(
        (plant) => plant.id === params.id
      );
      setPlant(plantData as Plant);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-200 p-1 rounded-full"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {isLoading ? null : (
          <>
            <h2>{plant?.species}</h2>

            <Link href={`/plants/${plant?.id}/edit`} className="ml-auto">
              <Button>Edit Plant</Button>
            </Link>
          </>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5 items-center">
        {isLoading ? <LoaderCircle className="animate-spin mx-auto" /> : <></>}
      </div>
    </>
  );
}
