"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import Link from "next/link";
import Spinner from "../spinner";
import PlantCard from "../cards/plant";
import SearchField from "../searchField";
import { Pagination, Plant } from "@/types/plant";
import { getPlants } from "@/services/plantServices";
import TablePagination from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function PublishedList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  //   Filters
  const [organization, setOrganization] = useState("All Organizations");
  const [family, setFamily] = useState("All Families");
  const [action, setAction] = useState("All Actions");

  const fetchPlants = () => {
    setIsLoading(true);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const organization = searchParams.get("organization");
    const family = searchParams.get("family");
    const action = searchParams.get("action");
    const search = searchParams.get("search");

    const queryParams = {
      ispublished: true,
      page: Number(page) || 1,
      limit: Number(limit) || 12,
      organization: organization,
      family: family,
      action_type: action,
      search: search,
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const onFilterChange = ({
    organization,
    family,
    action,
  }: {
    organization?: string;
    family?: string;
    action?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (organization) {
      setOrganization(organization);
      if (organization === "All Organizations") params.delete("organization");
      else params.set("organization", organization);
    }

    if (family) {
      setFamily(family);
      if (family === "All Families") params.delete("family");
      else params.set("family", family);
    }

    if (action) {
      setAction(action);
      if (action === "All Actions") params.delete("action");
      else params.set("action", action);
    }

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    fetchPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const organization = searchParams.get("organization") || "";
    const family = searchParams.get("family") || "";
    const action = searchParams.get("action") || "";

    onFilterChange({ organization, family, action });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Alert
        title="Published plant records will appear here and be visible to
        members of all organizations"
      ></Alert>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center flex-wrap">
            <p className="font-semibold pr-1">Filters</p>

            {/* Organization Filter */}
            <Select
              value={organization}
              onValueChange={(val) => onFilterChange({ organization: val })}
            >
              <SelectTrigger className="w-full sm:w-36 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All Organizations", "My Organization"].map((label) => {
                  return (
                    <SelectItem
                      key={label}
                      value={label}
                      className="rounded-lg [&_span]:flex"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Family Filter */}
            <Select
              value={family}
              onValueChange={(val) => onFilterChange({ family: val })}
            >
              <SelectTrigger className="w-full sm:w-36 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All Families", "Dipterocarpaceae", "Burseraceae"].map(
                  (label) => {
                    return (
                      <SelectItem
                        key={label}
                        value={label}
                        className="rounded-lg [&_span]:flex"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {label}
                        </div>
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>

            {/* Action Filter */}
            <Select
              value={action}
              onValueChange={(val) => onFilterChange({ action: val })}
            >
              <SelectTrigger className="w-full sm:w-32 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All Actions", "OCR", "AI Detection", "Herbarium"].map(
                  (label) => {
                    return (
                      <SelectItem
                        key={label}
                        value={label}
                        className="rounded-lg [&_span]:flex"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {label}
                        </div>
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>

            <div className="w-full md:w-auto md:ml-auto">
              <SearchField />
            </div>
          </div>

          {!isLoading && plants.length === 0 ? (
            <p className="py-10 text-center text-gray-500">No plants found.</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {plants.map((plant) => (
                  <Link key={plant.id} href={`/plants/${plant?.id}`}>
                    <PlantCard plant={plant} />
                  </Link>
                ))}
              </div>

              <TablePagination
                pagination={pagination}
                onPageClick={onPageClick}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
