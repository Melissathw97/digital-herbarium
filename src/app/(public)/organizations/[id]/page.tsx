"use client";

import { toast } from "sonner";
import Image from "next/image";
import { User } from "@/types/user";
import { Pages } from "@/types/pages";
import Spinner from "@/components/spinner";
import { Pagination } from "@/types/plant";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Organization } from "@/types/organization";
import { getOrganizationById } from "@/services/organizationServices";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import OrganizationDeleteModal from "@/components/modals/organizationDelete";
import OrganizationUpdateModal from "@/components/modals/organizationUpdate";
import OrganizationUserList from "@/components/organizations/organizationUserList";

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const [initialValues, setInitialValues] = useState<Partial<Organization>>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchOrganization = () => {
    setIsLoading(true);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const queryParams = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    getOrganizationById(params.id?.toString() || "", queryParams)
      .then((data) => {
        setInitialValues({
          id: data.data.id,
          nid: data.data.nid,
          name: data.data.name,
          imageUrl: data.data.imageUrl,
        });
        setUsers(data.data.users.data);
        setPagination(data.data.users.pagination);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(`Fail to fetch organization: ${error}`);
      });
  };

  useEffect(() => {
    fetchOrganization();
  }, [params.id, searchParams]);

  if (!initialValues) return <Spinner className="my-6" />;

  const onPageClick = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());

    router.push(`?${params.toString()}`);
  };

  const onEditClick = () => {
    setIsUpdateModalOpen(true);
  };

  const onDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => router.push(Pages.ORGANIZATIONS)}
            className="hover:bg-gray-200 p-1 rounded-full"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          {isLoading ? null : (
            <>
              <Image
                alt={initialValues.name || ""}
                src={initialValues.imageUrl || ""}
                width={45}
                height={45}
                className="rounded-full bg-white shadow-sm size-[45px]"
              />

              <div>
                <h2>{initialValues.name}</h2>
                <p className="text-gray-500 font-medium">
                  ID: {initialValues.nid}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            className="text-red-700 hover:text-red-700"
            onClick={onDeleteClick}
            title="Delete Organization"
          >
            Delete
          </Button>
          <Button onClick={onEditClick} title="Edit Organization">
            Edit
          </Button>
        </div>
      </div>

      <OrganizationUserList
        users={users}
        pagination={pagination}
        onPageClick={onPageClick}
        refreshOrganization={fetchOrganization}
      />

      <OrganizationUpdateModal
        open={isUpdateModalOpen}
        initialValues={initialValues as Organization}
        toggle={() => setIsUpdateModalOpen(false)}
        onUpdateSuccess={() => {
          setIsUpdateModalOpen(false);
          fetchOrganization();
        }}
      />

      <OrganizationDeleteModal
        open={isDeleteModalOpen}
        organization={initialValues as Organization}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteSuccess={() => {
          setIsDeleteModalOpen(false);
          router.push(Pages.ORGANIZATIONS);
        }}
      />
    </>
  );
}
