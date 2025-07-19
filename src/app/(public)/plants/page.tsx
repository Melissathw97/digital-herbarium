"use client";

import Link from "next/link";
import { Pages } from "@/types/pages";
import formatDate from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plant, ActionType } from "@/types/plant";
import PlantDeleteModal from "@/components/modals/plantDelete";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Pen,
  Trash,
} from "lucide-react";

// TODO: Integrate with Plants API
import mockPlantData from "@/constants/mock_plants.json";

export default function PlantsListPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedPlant, setSelectedPlant] = useState<Plant>();
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const headers: { label: string; dataKey: keyof Plant }[] = [
    { label: "Date", dataKey: "date" },
    { label: "Action Type", dataKey: "actionType" },
    { label: "Family", dataKey: "family" },
    { label: "Species", dataKey: "species" },
    { label: "Vernacular Name", dataKey: "vernacularName" },
    { label: "Barcode", dataKey: "barcode" },
    // { label: "Prefix", dataKey: "prefix" },
    // { label: "Number", dataKey: "number" },
    { label: "Collector", dataKey: "collector" },
    { label: "State", dataKey: "state" },
    { label: "District", dataKey: "district" },
    { label: "Location", dataKey: "location" },
  ];

  const getActionTypeStyling = (action: ActionType) => {
    switch (action) {
      case ActionType.AI_DETECTION:
        return "bg-violet-100 border-violet-300 text-violet-800";
      case ActionType.OCR:
      default:
        return "bg-sky-100 border-sky-300 text-sky-800";
    }
  };

  const onBulkCheckboxClick = () => {
    if (plants.length === selectedPlants.length) {
      setSelectedPlants([]);
    } else {
      setSelectedPlants(plants);
    }
  };

  const onCheckboxClick = (plant: Plant) => {
    const updatedPlants = [...selectedPlants];
    const index = selectedPlants.findIndex(
      (selected) => selected.id === plant.id
    );

    if (index > -1) {
      updatedPlants.splice(index, 1);
    } else {
      updatedPlants.push(plant);
    }

    setSelectedPlants(updatedPlants);
  };

  const onEditClick = (plant: Plant) => {
    router.push(`/plants/${plant.id}`);
  };

  const onDeleteClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setPlants(mockPlantData.plants as Plant[]);
      setIsLoading(false);
    }, 500);
  });

  return (
    <>
      <h1>Plant Collection</h1>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5">
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm">
            Export {selectedPlants.length ? selectedPlants.length : null} to CSV
          </Button>
          <Link href={Pages.PLANTS_NEW}>
            <Button size="sm">Add Plant</Button>
          </Link>
        </div>

        <div className="rounded-md border overflow-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">
                  <Input
                    type="checkbox"
                    checked={selectedPlants.length === plants.length}
                    onChange={onBulkCheckboxClick}
                  />
                </th>
                {headers.map(({ label }) => (
                  <th key={label} className="p-4 whitespace-nowrap">
                    {label}
                  </th>
                ))}
                <th className="px-4 sticky right-0 z-2 bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="p-3 text-gray-500"
                  >
                    <LoaderCircle className="animate-spin mx-auto" />
                  </td>
                </tr>
              ) : plants.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="p-3 text-center text-gray-500"
                  >
                    No plants found.
                  </td>
                </tr>
              ) : (
                plants.map((plant, index) => (
                  <tr
                    key={plant.id}
                    onClick={() => onEditClick(plant)}
                    className={`${index % 2 ? "bg-gray-100" : ""} cursor-pointer`}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <Input
                        type="checkbox"
                        className="mx-auto"
                        checked={selectedPlants.includes(plant)}
                        onChange={() => onCheckboxClick(plant)}
                      />
                    </td>
                    {headers.map(({ dataKey }) => (
                      <td key={dataKey} className="p-4 whitespace-nowrap">
                        {dataKey === "date" ? (
                          formatDate(plant[dataKey])
                        ) : dataKey === "actionType" ? (
                          <div
                            className={`${getActionTypeStyling(plant[dataKey])} px-1.5 py-0.5 text-[10px] rounded-sm font-semibold inline-block border`}
                          >
                            {plant[dataKey]}
                          </div>
                        ) : (
                          plant[dataKey]
                        )}
                      </td>
                    ))}
                    <td
                      className={`px-4 sticky right-0 z-2 ${index % 2 ? "bg-gray-100/90" : "bg-white/90"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-1">
                        <Link href={`/plants/${plant.id}/edit`}>
                          <Button
                            size="xs"
                            variant="outline"
                            className="hover:text-lime-700"
                          >
                            <Pen />
                          </Button>
                        </Link>
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-red-700 hover:text-red-700"
                          onClick={() => onDeleteClick(plant)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PlantDeleteModal
          open={isDeleteModalOpen}
          plant={selectedPlant}
          toggle={() => setIsDeleteModalOpen(false)}
          onConfirm={() => setIsDeleteModalOpen(false)}
        />

        <div className="flex items-center justify-between text-xs">
          <p>Showing 1 - 10 of 100 items</p>
          <div className="border rounded-sm flex items-center gap-1 px-1 py-1">
            <button className="w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs">
              <ChevronLeft className="w-3 h-3" />
            </button>
            {[1, 2, 3].map((number) => (
              <button
                key={number}
                className={`${number === currentPage ? "bg-lime-700/20" : ""} w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs`}
              >
                {number}
              </button>
            ))}
            <button className="w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
