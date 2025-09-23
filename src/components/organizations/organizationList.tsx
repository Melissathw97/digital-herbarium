"use client";

import Image from "next/image";
import { ImageIcon, Pen, Trash } from "lucide-react";
import Spinner from "@/components/spinner";
import { Pagination } from "@/types/plant";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Organization } from "@/types/organization";
import TablePagination from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrganizationList } from "@/services/organizationServices";

import OrganizationUpdateModal from "../modals/organizationUpdate";
import OrganizationCreateModal from "@/components/modals/organizationCreate";
import OrganizationDeleteModal from "@/components/modals/organizationDelete";

export default function OrganizationList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization>();
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const headers: {
    label: string;
    dataKey: keyof Organization | string;
    render?: (organization: Organization) => React.ReactNode;
  }[] = [
    {
      label: "ID",
      dataKey: "nid",
    },
    {
      label: "Organization",
      dataKey: "name",
      render: (organization) => (
        <div className="flex gap-3 items-center">
          {organization.imageUrl ? (
            <Image
              alt={organization?.name || "Organization logo"}
              src={organization.imageUrl}
              width={35}
              height={35}
              className="rounded-full shadow-md size-[35px] object-contain"
            />
          ) : (
            <div className="grid place-items-center bg-white text-gray-400/60 size-[35px] rounded-full shadow-md">
              <ImageIcon className="size-4 mx-auto" />
            </div>
          )}

          {organization.name}
        </div>
      ),
    },
  ];

  const fetchOrganizations = () => {
    setIsLoading(true);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    const queryParams = {
      search: search || "",
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    getOrganizationList(queryParams)
      .then((response) => {
        setOrganizations(response.data);
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

  const onEditClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsUpdateModalOpen(true);
  };

  const onDeleteClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsDeleteModalOpen(true);
  };

  const onViewClick = (organization: Organization) => {
    router.push(`/organizations/${organization.id}`);
  };

  useEffect(() => {
    fetchOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5">
        <div className="flex items-center justify-end gap-3">
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            Add Organization
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                {headers.map(({ label }) => (
                  <th key={label} className="pl-4 pr-3 py-3 whitespace-nowrap">
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
                    colSpan={headers.length + 2}
                    className="p-3 text-gray-500"
                  >
                    <Spinner />
                  </td>
                </tr>
              ) : organizations.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length + 2}
                    className="p-3 text-center text-gray-500"
                  >
                    No organizations found.
                  </td>
                </tr>
              ) : (
                organizations.map((organization, index) => (
                  <tr
                    key={organization.id}
                    id="has-click-event"
                    onClick={() => onViewClick(organization)}
                    className={`${index % 2 ? "bg-gray-100 border-y" : ""} cursor-pointer`}
                  >
                    {headers.map(({ dataKey, render }) => (
                      <td
                        key={dataKey}
                        className="p-4 whitespace-nowrap max-w-[220px] overflow-hidden overflow-ellipsis"
                      >
                        {render
                          ? render(organization)
                          : ((organization[
                              dataKey as keyof Organization
                            ] as unknown as React.ReactNode) ?? "-")}
                      </td>
                    ))}
                    <td
                      className={`p-4 sticky right-0 z-2 ${index % 2 ? "bg-gray-100/90" : "bg-white/90"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {organization.nid !== "OTHERS" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            variant="outline"
                            className="hover:text-lime-700"
                            onClick={() => onEditClick(organization)}
                          >
                            <Pen />
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            className="text-red-700 hover:text-red-700"
                            onClick={() => onDeleteClick(organization)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination pagination={pagination} onPageClick={onPageClick} />

        <OrganizationCreateModal
          open={isCreateModalOpen}
          toggle={() => setIsCreateModalOpen(false)}
        />

        <OrganizationUpdateModal
          open={isUpdateModalOpen}
          initialValues={selectedOrganization}
          toggle={() => setIsUpdateModalOpen(false)}
          onUpdateSuccess={() => {
            setIsUpdateModalOpen(false);
            fetchOrganizations();
          }}
        />

        <OrganizationDeleteModal
          open={isDeleteModalOpen}
          organization={selectedOrganization}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleteSuccess={() => {
            setIsDeleteModalOpen(false);
            fetchOrganizations();
          }}
        />
      </div>
    </>
  );
}
