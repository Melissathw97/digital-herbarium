"use client";

import { useCallback, useEffect, useState } from "react";
import { User, UserRole } from "@/types/user";
import { Pages } from "@/types/pages";
import SearchField from "../searchField";
import Spinner from "@/components/spinner";
import { Pagination } from "@/types/plant";
import UserCard from "@/components/cards/user";
import { Button } from "@/components/ui/button";
import AppPagination from "@/components/pagination";
import { useAuth } from "@/utils/supabase/tokenStorage";
import { useRouter, useSearchParams } from "next/navigation";
import UserDeleteModal from "@/components/modals/userDelete";
import { getUserProfile, getUsers } from "@/services/userServices";
import UserRoleUpdateModal from "@/components/modals/userRoleUpdate";
import UserBulkDeleteModal from "@/components/modals/userBulkDelete";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function MembersList() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const searchParams = useSearchParams();

  const [role, setRole] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [selectedUsers, setSelectedUsers] = useState<Set<User>>(new Set());
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setHasError(false);

    const page = searchParams.get("page");
    const role = searchParams.get("role");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    const queryParams = {
      search: search || "",
      role: role || "",
      page: Number(page) || 1,
      limit: Number(limit) || 12,
    };

    getUsers(queryParams)
      .then(async (data) => {
        setUsers(data.data);
        setPagination(data.pagination);

        if (!currentUser?.id) {
          const current = await getUserProfile();
          setCurrentUser(current);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
        setIsLoading(false);
      });
  };

  const onRoleSelect = (value: string) => {
    setRole(value);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("role", value);

    router.push(`?${currentParams.toString()}`);
  };

  const onPageClick = useCallback(
    (page: number) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      currentParams.set("page", page.toString());

      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams]
  );

  const onEditClick = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const onDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onBulkDeleteClick = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const onViewDetailsClick = (userId: string, profileId: string) => {
    router.push(`${Pages.MEMBERS}/${userId}?profileId=${profileId}`);
  };

  const onSelect = useCallback((user: User) => {
    setSelectedUsers((prevSelectedUsers) => {
      const newSelection = new Set(prevSelectedUsers);
      if (newSelection.has(user)) {
        const userToRemove = Array.from(newSelection).find(
          (u) => u.id === user.id
        );
        if (userToRemove) {
          newSelection.delete(userToRemove);
        }
      } else {
        newSelection.add(user);
      }

      return newSelection;
    });
  }, []);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>Users</h1>

        <div className="flex justify-between">
          <div className="flex gap-3 items-center flex-wrap">
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
          <div className="ml-auto flex gap-2">
            {selectedUsers.size && isAdmin ? (
              <Button
                variant="outline"
                onClick={onBulkDeleteClick}
                className="text-red-700 hover:text-red-900"
              >
                Delete Users ({selectedUsers.size})
              </Button>
            ) : null}

            <SearchField />
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner className="my-5" />
      ) : hasError ? (
        <p className="text-center text-gray-600 text-xs py-6">
          Unable to fetch users. Please try again later.
        </p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={selectedUsers.has(user)}
                currentUser={user.id === currentUser?.id}
                onViewDetails={
                  isAdmin
                    ? () => onViewDetailsClick(user.id, user.profileId)
                    : undefined
                }
                onEdit={
                  isAdmin &&
                  user.role !== UserRole.ADMIN &&
                  user.role !== UserRole.SUPER_ADMIN
                    ? () => onEditClick(user)
                    : undefined
                }
                onDelete={
                  isAdmin &&
                  user.role !== UserRole.ADMIN &&
                  user.role !== UserRole.SUPER_ADMIN
                    ? () => onDeleteClick(user)
                    : undefined
                }
                onSelect={
                  isAdmin &&
                  user.role !== UserRole.ADMIN &&
                  user.role !== UserRole.SUPER_ADMIN
                    ? () => onSelect(user)
                    : undefined
                }
              />
            ))}
          </div>

          <AppPagination pagination={pagination} onPageClick={onPageClick} />
        </>
      )}

      <UserRoleUpdateModal
        user={selectedUser}
        open={isUpdateModalOpen}
        toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
        onUpdateSuccess={fetchUsers}
      />

      <UserDeleteModal
        user={selectedUser}
        open={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        onDeleteSuccess={fetchUsers}
      />

      <UserBulkDeleteModal
        users={Array.from(selectedUsers)}
        open={isBulkDeleteModalOpen}
        toggle={() => setIsBulkDeleteModalOpen(!isBulkDeleteModalOpen)}
        onDeleteSuccess={fetchUsers}
      />
    </>
  );
}
