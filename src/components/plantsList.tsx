"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pages } from "@/types/pages";
import Badge from "@/components/badge";
import { Pen, Trash, X } from "lucide-react";
import Spinner from "@/components/spinner";
import formatDate from "@/utils/formatDate";
import { User, UserRole } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/pagination";
import { getUserProfile } from "@/services/userServices";
import { useRouter, useSearchParams } from "next/navigation";
import { Plant, ActionType, Pagination } from "@/types/plant";
import PlantDeleteModal from "@/components/modals/plantDelete";
import { getPlants, postPlantsExport } from "@/services/plantServices";
import PlantBulkDeleteModal from "@/components/modals/plantBulkDelete";

export default function PlantsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const [selectedPlant, setSelectedPlant] = useState<Plant>();
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

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

  const isAdmin = useMemo(
    () => currentUser?.role === UserRole.ADMIN,
    [currentUser]
  );

  const fetchPlants = () => {
    setIsLoading(true);
    setSelectedPlants([]);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const queryParams = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    getPlants(queryParams)
      .then(async (response) => {
        setPlants(response.data);
        setPagination(response.pagination);

        if (!currentUser?.id) {
          const current = await getUserProfile();
          setCurrentUser(current);
        }

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

  const onExportClick = () => {
    postPlantsExport({ ids: selectedPlants.map((plant) => plant.id) })
      .then(() => {
        toast.success("Data exported to excel successfully");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const onBulkDeleteClick = () => {
    setIsBulkDeleteModalOpen(true);
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

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            {selectedPlants.length ? (
              <div className="flex items-center gap-5 px-1.5 font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlants([])}
                >
                  <X className="text-gray-500" />
                </Button>
                {selectedPlants.length} selected
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {selectedPlants.length > 0 && isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkDeleteClick}
                className="text-red-700 hover:text-red-900"
              >
                Delete{" "}
                {selectedPlants.length ? `(${selectedPlants.length})` : null}
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onExportClick}>
              Export to Excel{" "}
              {selectedPlants.length ? `(${selectedPlants.length})` : null}
            </Button>
            <Link href={Pages.PLANTS_NEW}>
              <Button size="sm">Add Plant</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-md border overflow-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3 px-4">
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
                    <Spinner />
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
                      <td
                        key={dataKey}
                        className="p-4 whitespace-nowrap max-w-[220px] overflow-hidden overflow-ellipsis"
                      >
                        {dataKey === "date" ? (
                          plant[dataKey] ? (
                            formatDate(plant[dataKey])
                          ) : (
                            "-"
                          )
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
                        {isAdmin && (
                          <Button
                            size="xs"
                            variant="outline"
                            className="text-red-700 hover:text-red-700"
                            onClick={() => onDeleteClick(plant)}
                          >
                            <Trash />
                          </Button>
                        )}
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
          onDeleteSuccess={fetchPlants}
        />

        <PlantBulkDeleteModal
          open={isBulkDeleteModalOpen}
          plants={selectedPlants}
          toggle={() => setIsBulkDeleteModalOpen(false)}
          onDeleteSuccess={fetchPlants}
        />
      </div>
    </>
  );
}
