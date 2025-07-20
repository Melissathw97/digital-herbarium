"use client";

import { Fragment, ReactElement, useEffect, useMemo, useState } from "react";
import { ActionType, Plant } from "@/types/plant";
import Link from "next/link";
import Image from "next/image";
import { Pages } from "@/types/pages";
import Badge from "@/components/badge";
import Spinner from "@/components/spinner";
import formatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import PlantDeleteModal from "@/components/modals/plantDelete";
import { ChevronLeftIcon, ScanText, Sparkles } from "lucide-react";
import { deletePlant, getPlantById } from "@/services/plantServices";

export default function PlantDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [plant, setPlant] = useState<Plant>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getBadge = (
    action: ActionType
  ): {
    variant: "purple" | "default";
    icon: ReactElement;
  } => {
    switch (action) {
      case ActionType.AI_DETECTION:
        return {
          variant: "purple",
          icon: <Sparkles />,
        };
      case ActionType.OCR:
      default:
        return {
          variant: "default",
          icon: <ScanText />,
        };
    }
  };

  const displayData = useMemo(() => {
    return [
      { label: "Family", value: plant?.family },
      { label: "Species", value: plant?.species },
      { label: "Vernacular Name", value: plant?.vernacularName },
      { label: "Barcode", value: plant?.barcode },
      { label: "Prefix", value: plant?.prefix },
      { label: "Number", value: plant?.number },
      { label: "Collector", value: plant?.collector },
      { label: "Date", value: plant?.date ? formatDate(plant?.date) : "-" },
      { label: "State", value: plant?.state },
      { label: "District", value: plant?.district },
      { label: "Location", value: plant?.location },
    ];
  }, [plant]);

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

  const onDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const onDeleteConfirm = () => {
    if (plant) {
      deletePlant({ id: plant.id })
        .then(() => {
          router.push(Pages.PLANTS);
          alert("Plant deleted successfully!");
        })
        .catch((error) => {
          setIsDeleteModalOpen(false);
          alert(error);
        });
    }
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
            <div className="bg-gray-100 max-w-[50%] rounded-sm">
              <Image
                alt={plant?.species || ""}
                src={plant?.imagePath || ""}
                width={500}
                height={200}
              />
            </div>

            <div className="flex-1 p-8 font-semibold shadow-sm rounded-sm border flex flex-col gap-6 sticky top-[80px] items-start">
              <div className="flex gap-2">
                <Badge variant={getBadge(plant.actionType).variant} bordered>
                  {getBadge(plant.actionType).icon}
                  {plant.actionType}
                </Badge>
                {plant.actionType === ActionType.AI_DETECTION && (
                  <Badge variant="info" bordered>
                    Confidence Level: {plant.confidenceLevel * 100}%
                  </Badge>
                )}
              </div>
              <div className="grid lg:grid-cols-[180px_auto] items-center gap-2 lg:gap-3">
                {displayData.map(({ label, value }) => (
                  <Fragment key={label}>
                    <p className="text-lime-700 uppercase text-xs">{label}:</p>
                    <div className="mb-4 lg:mb-0">
                      {label === "Species" ? (
                        <em>{value || "-"}</em>
                      ) : (
                        <p>{value || "-"}</p>
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <PlantDeleteModal
        open={isDeleteModalOpen}
        plant={plant}
        toggle={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
}
