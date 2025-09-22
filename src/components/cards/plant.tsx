import { ActionType, Plant } from "@/types/plant";
import { ImageIcon, LeafIcon } from "lucide-react";
import Badge from "../badge";
import Image from "next/image";

export default function PlantCard({ plant }: { plant: Plant }) {
  const getBadgeVariant = (family: string) => {
    switch (family) {
      case ActionType.AI_DETECTION:
        return "purple";

      case ActionType.OCR:
        return "default";

      case ActionType.HERBARIUM:
        return "success";

      default:
        return "info";
    }
  };

  return (
    <div className="bg-white border shadow-sm p-4 rounded-md flex sm:flex-col gap-4 items-start transition duration-300 hover:translate-y-[-4px] hover:shadow-md">
      {plant.imageUrl ? (
        <div className="relative h-40 w-40 sm:w-full">
          <Image
            alt={plant.species}
            fill={true}
            className="object-contain rounded-sm bg-gray-100"
            src={plant.imageUrl}
          />
        </div>
      ) : (
        <div className="size-40 sm:w-full bg-gray-100 rounded-sm grid place-items-center text-gray-300">
          <ImageIcon />
        </div>
      )}
      <div className="flex flex-col gap-4 items-start w-full">
        <div className="flex flex-col gap-1.5 w-full">
          <div className="sm:text-base font-semibold flex gap-1.5 items-center">
            <LeafIcon className="size-4 text-lime-700" />
            <h6 className="whitespace-nowrap overflow-hidden overflow-ellipsis">
              {plant.species}
            </h6>
          </div>
          <p className="text-xs">Family: {plant.family}</p>
        </div>
        <Badge variant={getBadgeVariant(plant.actionType)} bordered>
          {plant.actionType}
        </Badge>

        <div className="w-full flex gap-2 items-center text-xs text-gray-500">
          <div className="bg-gray-200 size-8 rounded-full grid place-items-center font-semibold text-gray-500 uppercase shrink-0 text-[10px]">
            {plant.creatorFirstName?.substring(0, 1)}
          </div>
          <div className="overflow-hidden flex flex-col gap-0.5">
            <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium">
              {plant.creatorFirstName} {plant.creatorLastName}
            </p>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[10px]">
              {plant.organization?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
