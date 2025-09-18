"use client";

import { Fragment, ReactElement, useEffect, useMemo, useState } from "react";
import { ActionType, Plant, Status } from "@/types/plant";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/user";
import { Pages } from "@/types/pages";
import Spinner from "@/components/spinner";
import formatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/utils/supabase/tokenStorage";
import { getUserProfile } from "@/services/userServices";
import Badge, { BadgeVariants } from "@/components/badge";
import PlantDeleteModal from "@/components/modals/plantDelete";
import { getPlantById, getPlantImage } from "@/services/plantServices";
import {
  CheckCircle,
  ChevronLeftIcon,
  Gauge,
  ImageIcon,
  ScanText,
  Sparkles,
  Sprout,
} from "lucide-react";
import PlantPublishModal from "@/components/modals/plantPublish";

export default function PlantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [plant, setPlant] = useState<Plant>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>();

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getBadge = (
    action: ActionType
  ): {
    variant: BadgeVariants;
    icon: ReactElement;
  } => {
    switch (action) {
      case ActionType.AI_DETECTION:
        return {
          variant: "purple",
          icon: <Sparkles />,
        };
      case ActionType.HERBARIUM:
        return {
          variant: "success",
          icon: <Sprout />,
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
      { label: "Status", value: plant?.status },
      ...(plant?.status === Status.REJECTED
        ? [{ label: "Reason", value: plant?.remarks }]
        : []),
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
      { label: "Elevation", value: plant?.elevation },
      { label: "Latitude", value: plant?.latitude },
      { label: "Longitude", value: plant?.longitude },
      { label: "Additional Notes", value: plant?.additionalNotes },
    ];
  }, [plant]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case Status.PENDING_APPROVAL:
        return "text-yellow-600";
      case Status.APPROVED:
        return "text-green-700";
      case Status.REJECTED:
        return "text-red-700";
    }
  };

  const fetchPlant = () => {
    getPlantById({ id: params.id?.toString() || "" })
      .then(async (data) => {
        const { imageUrl } = await getPlantImage({
          id: params.id?.toString() || "",
        });

        setPlant({
          ...data,
          imagePath: imageUrl || "",
        });

        const current = await getUserProfile();
        setCurrentUser(current);

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPlant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const onPublishClick = () => {
    setIsPublishModalOpen(true);
  };

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
            <div className="flex gap-3 items-center">
              <h2>{plant?.species}</h2>
              {plant?.isPublished && (
                <Badge variant="success" bordered size="lg">
                  <CheckCircle />
                  Published
                </Badge>
              )}
            </div>

            {currentUser?.organizations?.name === plant.organization?.name ? (
              <div className="ml-auto flex gap-2">
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-700 hover:text-red-900"
                      onClick={onDeleteClick}
                    >
                      Delete Plant
                    </Button>
                    {plant.status === Status.APPROVED && (
                      <Button
                        variant="outline"
                        className="hover:text-lime-700"
                        onClick={onPublishClick}
                      >
                        {plant.isPublished
                          ? "Unpublish Plant"
                          : "Publish Plant"}
                      </Button>
                    )}
                  </>
                )}
                {plant.status !== Status.APPROVED &&
                  plant.creatorEmail === currentUser?.email && (
                    <Link href={`/plants/${plant?.id}/edit`}>
                      <Button>Edit Plant</Button>
                    </Link>
                  )}
              </div>
            ) : null}
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
            <div className="bg-gray-100 w-full min-h-[400px] max-w-[50%] rounded-sm grid place-items-center">
              {plant.imagePath ? (
                <Image
                  alt={plant?.species || ""}
                  src={plant?.imagePath || ""}
                  width={500}
                  height={200}
                />
              ) : (
                <div className="flex flex-col gap-2 text-gray-400/60 font-semibold">
                  <ImageIcon className="size-6 mx-auto" />
                  <p>No plant image</p>
                </div>
              )}
            </div>
            <div className="flex-1 p-8 font-semibold shadow-sm rounded-sm border flex flex-col gap-6 sticky top-[80px] items-start">
              <div className="flex gap-2">
                <Badge variant={getBadge(plant.actionType).variant} bordered>
                  {getBadge(plant.actionType).icon}
                  {plant.actionType}
                </Badge>
                {plant.actionType === ActionType.AI_DETECTION &&
                  plant.confidenceLevel && (
                    <Badge variant="info" bordered>
                      <Gauge />
                      Confidence Level:{" "}
                      {Math.round(plant.confidenceLevel * 100)}%
                    </Badge>
                  )}
              </div>
              <div className="grid lg:grid-cols-[180px_auto] gap-2 lg:gap-3">
                {displayData.map(({ label, value }) => (
                  <Fragment key={label}>
                    <p className="text-lime-700 uppercase text-xs mt-0.5 font-bold">
                      {label}:
                    </p>
                    <div className="mb-4 lg:mb-0">
                      {label === "Status" && value ? (
                        <p className={getStatusColor(value)}>{value}</p>
                      ) : label === "Species" ? (
                        <em>{value || "-"}</em>
                      ) : label === "Reason" ? (
                        <p className="text-red-700">{value || "-"}</p>
                      ) : (
                        <p>{value || "-"}</p>
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
              <p className="text-gray-600 font-normal italic text-xs mt-6 -mb-2">
                Record created by: {plant.creatorFirstName}{" "}
                {plant.creatorLastName} ({plant.organization?.name})
              </p>
            </div>
          </div>
        )}
      </div>

      <PlantPublishModal
        open={isPublishModalOpen}
        plant={plant}
        toggle={() => setIsPublishModalOpen(false)}
        onPublishSuccess={fetchPlant}
      />

      <PlantDeleteModal
        open={isDeleteModalOpen}
        plant={plant}
        toggle={() => setIsDeleteModalOpen(false)}
        onDeleteSuccess={() => router.push(Pages.PLANTS)}
      />
    </>
  );
}
