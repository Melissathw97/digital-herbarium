"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/badge";
import Spinner from "@/components/spinner";
import formatDate from "@/utils/formatDate";
import { Eye, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlants } from "@/services/plantServices";
import TablePagination from "@/components/pagination";
import { useAuth } from "@/utils/supabase/tokenStorage";
import { useRouter, useSearchParams } from "next/navigation";
import PlantDeleteModal from "@/components/modals/plantDelete";
import { Plant, ActionType, Pagination, Status } from "@/types/plant";

export default function ApprovalsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMember, isExpert, isAdmin } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const [selectedPlant, setSelectedPlant] = useState<Plant>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const headers: { label: string; dataKey: keyof Plant }[] = [
    { label: "Date Collected", dataKey: "date" },
    { label: "Action Type", dataKey: "actionType" },
    { label: "Status", dataKey: "status" },
    { label: "Family", dataKey: "family" },
    { label: "Species", dataKey: "species" },
    { label: "Vernacular Name", dataKey: "vernacularName" },
    { label: "Barcode", dataKey: "barcode" },
    // { label: "Prefix", dataKey: "prefix" },
    // { label: "Number", dataKey: "number" },
    { label: "Collector", dataKey: "collector" },
    ...(isExpert || isAdmin
      ? [
          { label: "State", dataKey: "state" as keyof Plant },
          { label: "District", dataKey: "district" as keyof Plant },
          { label: "Location", dataKey: "location" as keyof Plant },
        ]
      : []),
  ];

  const fetchPlants = () => {
    setIsLoading(true);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const queryParams = {
      ispublished: false,
      status: ["pending approval", "rejected"],
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    getPlants(queryParams)
      .then(async (response) => {
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

  const getBadgeVariant = (text: ActionType | Status) => {
    switch (text) {
      case ActionType.HERBARIUM:
      case Status.APPROVED:
        return "success";
      case Status.PENDING_APPROVAL:
        return "warning";
      case Status.REJECTED:
        return "danger";
      case ActionType.AI_DETECTION:
        return "purple";
      case ActionType.OCR:
      default:
        return "default";
    }
  };

  const onEditClick = (plant: Plant) => {
    router.push(`/approvals/${plant.id}/edit`);
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
    <div className="bg-white shadow-sm rounded-lg px-4 py-5 border flex flex-col gap-4">
      <div className="rounded-md border overflow-auto text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
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
                <td colSpan={headers.length} className="p-3 text-gray-500">
                  <Spinner />
                </td>
              </tr>
            ) : plants.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="p-3 text-center text-gray-500"
                >
                  No approvals found.
                </td>
              </tr>
            ) : (
              plants.map((plant, index) => (
                <tr
                  key={plant.id}
                  onClick={() => onEditClick(plant)}
                  className={`${index % 2 ? "bg-gray-100" : ""} cursor-pointer`}
                >
                  {headers.map(({ dataKey }: { dataKey: string }) => (
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
                      ) : dataKey === "actionType" || dataKey === "status" ? (
                        <Badge
                          variant={getBadgeVariant(plant[dataKey])}
                          bordered
                        >
                          {plant[dataKey] || "-"}
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
                      {isMember && (
                        <>
                          {plant.status === Status.PENDING_APPROVAL && (
                            <Link href={`/plants/${plant.id}`}>
                              <Button
                                size="xs"
                                variant="outline"
                                className="hover:text-lime-700"
                              >
                                <Eye />
                              </Button>
                            </Link>
                          )}
                          {plant.status === Status.REJECTED && (
                            <Link href={`/approvals/${plant.id}/edit`}>
                              <Button
                                size="xs"
                                variant="outline"
                                className="hover:text-lime-700"
                              >
                                <Pen />
                              </Button>
                            </Link>
                          )}
                        </>
                      )}

                      {isExpert && (
                        <Link href={`/approvals/${plant.id}/edit`}>
                          <Button
                            size="xs"
                            variant="outline"
                            className="hover:text-lime-700"
                          >
                            <Pen />
                          </Button>
                        </Link>
                      )}

                      {isAdmin && (
                        <>
                          <Link href={`/approvals/${plant.id}/edit`}>
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
                        </>
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
    </div>
  );
}
