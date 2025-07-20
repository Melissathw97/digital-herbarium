"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Plant } from "@/types/plant";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/components/spinner";
import formatDate from "@/utils/formatDate";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import PlantDeleteModal from "@/components/modals/plantDelete";

// TODO: Integrate with Plants API
import mockPlantData from "@/constants/mock_plants.json";

export default function PlantDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [plant, setPlant] = useState<Plant>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const displayData = useMemo(() => {
    return [
      { label: "Family", value: plant?.family },
      { label: "Species", value: plant?.species },
      { label: "Barcode", value: plant?.barcode },
      { label: "Prefix", value: plant?.prefix },
      { label: "Number", value: plant?.number },
      { label: "Collector", value: plant?.collector },
      { label: "Date", value: plant?.date ? formatDate(plant?.date) : "-" },
      { label: "State", value: plant?.state },
      { label: "District", value: plant?.district },
      { label: "Location", value: plant?.location },
      { label: "Vernacular Name", value: plant?.vernacularName },
    ];
  }, [plant]);

  useEffect(() => {
    setTimeout(() => {
      const plantData = mockPlantData.plants.find(
        (plant) => plant.id === params.id
      );

      if (plantData) {
        setPlant(plantData as Plant);
      }

      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const onDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-200 p-1 rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {isLoading || !plant ? null : (
          <>
            <h2>{plant?.species}</h2>

            <Button
              variant="outline"
              className="ml-auto text-red-700 hover:text-red-700"
              onClick={onDeleteClick}
            >
              Delete Plant
            </Button>
            <Link href={`/plants/${plant?.id}/edit`}>
              <Button>Edit Plant</Button>
            </Link>
          </>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5 items-center">
        {isLoading ? (
          <Spinner className="my-9" />
        ) : !plant ? (
          <p className="text-center text-gray-600 text-xs py-10">
            No plant data found. Please try again later.
          </p>
        ) : (
          <div className="flex w-full gap-6 items-start">
            <Image
              alt={plant?.species || ""}
              src={plant?.imagePath || ""}
              width={500}
              height={200}
            />

            <div className="flex-1 p-10 font-semibold shadow-sm rounded-sm border flex flex-col gap-3 grid grid-cols-[150px_auto] items-center sticky top-[80px]">
              {displayData.map(({ label, value }) => (
                <Fragment key={label}>
                  <p className="text-lime-700 uppercase text-xs">{label}:</p>
                  {label === "Species" ? <em>{value}</em> : <p>{value}</p>}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      <PlantDeleteModal
        open={isDeleteModalOpen}
        plant={plant}
        toggle={() => setIsDeleteModalOpen(false)}
        onConfirm={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
