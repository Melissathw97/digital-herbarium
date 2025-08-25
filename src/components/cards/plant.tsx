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

      default:
        return "info";
    }
  };

  return (
    <div className="bg-white border shadow-sm p-4 rounded-md flex sm:flex-col gap-4 items-start transition duration-300 hover:translate-y-[-4px] hover:shadow-md">
      {plant.imagePath && plant.imagePath.startsWith("http") ? (
        <div className="relative h-40 w-40 sm:w-full">
          <Image
            alt={plant.species}
            fill={true}
            className="object-contain rounded-sm bg-gray-100"
            src="http://127.0.0.1:54321/storage/v1/object/public/detection_data/detection/ai/fa77dfa0-946f-49ea-9dda-1703d80f4bb6/KEPDEFAULT_Burseraceae_Dacryodes_rugosa_a_1754741775534.jpg"
          />
        </div>
      ) : (
        <div className="size-40 sm:w-full bg-gray-100 rounded-sm grid place-items-center text-gray-300">
          <ImageIcon />
        </div>
      )}
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-1.5">
          <h6 className="sm:text-base font-semibold flex gap-1.5 items-center">
            <LeafIcon className="size-4 text-lime-700" /> {plant.species}
          </h6>
          <p className="text-xs">Family: {plant.family}</p>
        </div>
        <Badge variant={getBadgeVariant(plant.actionType)} bordered>
          {plant.actionType}
        </Badge>

        <div className="w-full flex gap-2 items-center text-xs text-gray-500">
          <div className="bg-gray-200 h-6 w-6 rounded-full grid place-items-center font-semibold text-gray-500 uppercase shrink-0 text-[10px]">
            {plant.creatorFirstName?.substring(0, 1)}
          </div>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">
            {plant.creatorFirstName} {plant.creatorLastName}
          </p>
        </div>
      </div>
    </div>
  );
}
