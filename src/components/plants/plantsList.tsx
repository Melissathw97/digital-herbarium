"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { User } from "@/types/user";
import { Pages } from "@/types/pages";
import Badge from "@/components/badge";
import Spinner from "@/components/spinner";
import formatDate from "@/utils/formatDate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/pagination";
import PlantPublishModal from "../modals/plantPublish";
import { useAuth } from "@/utils/supabase/tokenStorage";
import { getUserProfile } from "@/services/userServices";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  BookX,
  Import,
  Pen,
  ScanText,
  Sparkles,
  Trash,
  X,
} from "lucide-react";
import PlantDeleteModal from "@/components/modals/plantDelete";
import { Plant, ActionType, Pagination, Status } from "@/types/plant";
import { getPlants, postPlantsExport } from "@/services/plantServices";
import PlantBulkDeleteModal from "@/components/modals/plantBulkDelete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function PlantsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isExpert, isAdmin } = useAuth();

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
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Filters
  const [actionType, setActionType] = useState(
    () => searchParams.get("action") || "all"
  );
  const [isPublished, setIsPublished] = useState(
    () => searchParams.get("ispublished") || "all"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const onFilterSelect = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set(key, value);

    router.push(`?${currentParams.toString()}`);
  };

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const onPageClick = (page: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.set("page", page.toString());

    router.push(`?${currentParams.toString()}`);
  };

  const headers: { label: string; dataKey: keyof Plant }[] = useMemo(() => {
    return [
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
  }, [isExpert, isAdmin]);

  const fetchPlants = () => {
    setIsLoading(true);
    setSelectedPlants([]);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const queryParams = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      ispublished: isPublished,
      search: search || "",
      action: actionType,
    };

    if (search) setSearch(search);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());

      newParams.set("tab", "All Records"); // Override tab in case it's wrong
      newParams.set("page", "1"); // Reset page to 1

      if (search) {
        newParams.set("search", search);
      } else {
        newParams.delete("search"); // Remove search param if search is empty
      }

      if (isPublished) {
        newParams.set("ispublished", isPublished);
      } else {
        newParams.delete("ispublished");
      }

      if (actionType && actionType !== "all") {
        newParams.set("action", actionType);
      } else {
        newParams.delete("action");
      }

      const newUrl = newParams.toString();
      const currentUrl = searchParams.toString();

      // Only update URL if it's actually different
      if (newUrl !== currentUrl) {
        router.replace(`?${newUrl}`);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isPublished, actionType]);

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

  const onPublishClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsPublishModalOpen(true);
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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
          <p className="font-semibold">Filters</p>

          {/* Action Type Filter */}
          <Select
            value={actionType}
            onValueChange={(value) => {
              setActionType(value);
              onFilterSelect("action", value);
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[
                  { label: "All Actions", value: "all" },
                  { label: "OCR", value: "ocr" },
                  { label: "AI Detection", value: "ai_detection" },
                  { label: "Herbarium", value: "herbarium" },
                ].map(({ label, value }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Publish Filter */}
          <Select
            value={isPublished}
            onValueChange={(value) => {
              setIsPublished(value);
              onFilterSelect("ispublished", value);
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[
                  { label: "All", value: "all" },
                  { label: "Published", value: "true" },
                  { label: "Unpublished", value: "false" },
                ].map(({ label, value }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="md:ml-auto flex gap-2">
          <Input
            name="search"
            value={search}
            onChange={onInputChange}
            className="bg-white shadow-sm min-w-[220px]"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white shadow-sm rounded-lg px-4 py-5 border flex flex-col gap-4">
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
            {plants.length > 0 && (
              <Button variant="secondary" size="sm" onClick={onExportClick}>
                Export to Excel{" "}
                {selectedPlants.length ? `(${selectedPlants.length})` : null}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-sm">
                <div className="bg-lime-800 text-white shadow-xs hover:bg-lime-900 inline-flex items-center justify-center font-semibold transition-all cursor-pointer h-8 rounded-sm gap-1.5 px-3 text-xs">
                  Add Plant
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={Pages.PLANTS_NEW_OCR}>
                  <DropdownMenuItem className="cursor-pointer px-3 py-2">
                    <ScanText /> Scan with OCR
                  </DropdownMenuItem>
                </Link>
                <Link href={Pages.PLANTS_NEW_AI}>
                  <DropdownMenuItem className="cursor-pointer px-3 py-2">
                    <Sparkles /> AI Detection
                  </DropdownMenuItem>
                </Link>
                {isAdmin && (
                  <Link href={Pages.PLANTS_NEW_IMPORT}>
                    <DropdownMenuItem className="cursor-pointer px-3 py-2">
                      <Import />
                      Import Data
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
                {isLoading
                  ? Array.from({ length: 8 }, (_, i) => i + 1).map((i) => (
                      <th key={i} className="min-w-[100px]">
                        -
                      </th>
                    ))
                  : headers.map(({ label }) => (
                      <th key={label} className="p-4 whitespace-nowrap">
                        {label}
                      </th>
                    ))}
                <th className="p-4 sticky right-0 z-2 bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={isLoading ? 10 : headers.length + 1}
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
                        {plant.status !== Status.APPROVED &&
                          plant.creatorEmail === currentUser?.email && (
                            <Link href={`/plants/${plant.id}/edit`}>
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
                            {plant.status === Status.APPROVED && (
                              <Button
                                size="xs"
                                variant="outline"
                                className="hover:text-lime-700"
                                onClick={() => onPublishClick(plant)}
                              >
                                {plant.isPublished ? <BookX /> : <BookOpen />}
                              </Button>
                            )}
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

        <PlantPublishModal
          open={isPublishModalOpen}
          plant={selectedPlant}
          toggle={() => setIsPublishModalOpen(false)}
          onPublishSuccess={fetchPlants}
        />

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
