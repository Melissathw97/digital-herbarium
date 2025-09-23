"use client";

import { useState } from "react";
import { Pen } from "lucide-react";
import { Button } from "../ui/button";
import { Pagination } from "@/types/plant";
import formatDate from "@/utils/formatDate";
import { User, UserRole } from "@/types/user";
import UserRoleBadge from "../users/userRoleBadge";
import TablePagination from "@/components/pagination";
import UserOrganizationUpdateModal from "../modals/userOrganizationUpdate";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";

type OrganizationUserProps = {
  users: User[];
  pagination: Pagination;
  onPageClick: (page: number) => void;
  refreshOrganization: () => void;
};

export default function OrganizationUserList({
  users,
  pagination,
  onPageClick,
  refreshOrganization,
}: OrganizationUserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const headers: {
    label: string;
    dataKey: keyof User | string;
    render?: (insect: User) => React.ReactNode;
  }[] = [
    { label: "First Name", dataKey: "firstName" },
    { label: "Last Name", dataKey: "lastName" },
    { label: "Email", dataKey: "email" },
    {
      label: "Role",
      dataKey: "role",
      render: (user) => <UserRoleBadge user={user} />,
    },
    {
      label: "Joined on",
      dataKey: "joinedAt",
      render: (user) => (user.joinedAt ? formatDate(user.joinedAt) : "-"),
    },
  ];

  const handlePageClick = (page: number) => {
    onPageClick(page);
  };

  const onRoleSelect = (value: string) => {
    setRole(value);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("role", value);

    router.push(`?${currentParams.toString()}`);
  };

  const onEditClick = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5">
        <div className="flex gap-3 items-center flex-wrap mx-1">
          <p className="font-semibold">Filters</p>

          {/* Role Filter */}
          <Select value={role} onValueChange={onRoleSelect}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[
                  { label: "All Roles", value: "all" },
                  { label: "Super Admin", value: UserRole.SUPER_ADMIN },
                  { label: "Admin", value: UserRole.ADMIN },
                  { label: "Expert", value: UserRole.EXPERT },
                  { label: "Member", value: UserRole.MEMBER },
                ].map(({ label, value }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="rounded-lg [&_span]:flex"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length + 2}
                    className="p-3 text-center text-gray-500"
                  >
                    No users found in this organization.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`${index % 2 ? "bg-gray-100 border-y" : ""}`}
                  >
                    {headers.map(({ dataKey, render }) => (
                      <td
                        key={dataKey}
                        className="p-4 whitespace-nowrap max-w-[220px] overflow-hidden overflow-ellipsis"
                      >
                        {render
                          ? render(user)
                          : ((user[
                              dataKey as keyof User
                            ] as unknown as React.ReactNode) ?? "-")}
                      </td>
                    ))}

                    <td
                      className={`p-3 sticky right-0 z-2 ${index % 2 ? "bg-gray-100/90" : "bg-white/90"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="xs"
                        variant="outline"
                        title="Change User Organization"
                        onClick={() => onEditClick(user)}
                      >
                        <Pen />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          pagination={pagination}
          onPageClick={handlePageClick}
        />

        <UserOrganizationUpdateModal
          user={selectedUser}
          open={isUpdateModalOpen}
          toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
          onUpdateSuccess={refreshOrganization}
        />
      </div>
    </>
  );
}
