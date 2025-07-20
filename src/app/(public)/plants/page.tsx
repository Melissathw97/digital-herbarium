"use client";

import Link from "next/link";
import { Pages } from "@/types/pages";
import Badge from "@/components/badge";
import formatDate from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPlants } from "@/services/plantServices";
import TablePagination from "@/components/pagination";
import { LoaderCircle, Pen, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plant, ActionType, Pagination } from "@/types/plant";
import PlantDeleteModal from "@/components/modals/plantDelete";

export default function PlantsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const [selectedPlant, setSelectedPlant] = useState<Plant>();
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const headers: { label: string; dataKey: keyof Plant }[] = [
    { label: "Date Collected", dataKey: "date" },
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

  const fetchPlants = () => {
    setIsLoading(true);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const queryParams = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    getPlants(queryParams)
      .then((response) => {
        setPlants(response.data);
        setPagination(response.pagination);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const onPageClick = (page: number) => {
    router.push(`?page=${page.toString()}`);
  };

  const getBadgeVariant = (action: ActionType) => {
    switch (action) {
      case ActionType.AI_DETECTION:
        return "purple";
      case ActionType.OCR:
      default:
        return "default";
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
    fetchPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
                  {plants.length > 0 && (
                    <Input
                      type="checkbox"
                      checked={selectedPlants.length === plants.length}
                      onChange={onBulkCheckboxClick}
                    />
                  )}
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
                          <Badge
                            variant={getBadgeVariant(plant[dataKey])}
                            bordered
                          >
                            {plant[dataKey]}
                          </Badge>
                        ) : (
                          plant[dataKey] || "-"
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

        <TablePagination pagination={pagination} onPageClick={onPageClick} />

        <PlantDeleteModal
          open={isDeleteModalOpen}
          plant={selectedPlant}
          toggle={() => setIsDeleteModalOpen(false)}
          onConfirm={() => setIsDeleteModalOpen(false)}
        />
      </div>
    </>
  );
}
