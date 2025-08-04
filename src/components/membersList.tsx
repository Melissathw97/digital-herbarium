"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { User, UserRole } from "@/types/user";
import Spinner from "@/components/spinner";
import { Pagination } from "@/types/plant";
import { Input } from "@/components/ui/input";
import UserCard from "@/components/cards/user";
import { Button } from "@/components/ui/button";
import AppPagination from "@/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import UserDeleteModal from "@/components/modals/userDelete";
import { getUserProfile, getUsers } from "@/services/userServices";
import UserRoleUpdateModal from "@/components/modals/userRoleUpdate";
import UserBulkDeleteModal from "@/components/modals/userBulkDelete";

export default function MembersList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [selectedUsers, setSelectedUsers] = useState<Set<User>>(new Set());
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const isAdmin = useMemo(
    () => currentUser?.role === UserRole.ADMIN,
    [currentUser]
  );

  const fetchUsers = async () => {
    setIsLoading(true);
    setHasError(false);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");

    const queryParams = {
      search: search || "",
      page: Number(page) || 1,
      limit: Number(limit) || 12,
    };

    if (search) setSearch(search);

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

  const onPageClick = useCallback(
    (page: number) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      currentParams.set("page", page.toString());

      if (search) {
        currentParams.set("search", search);
      } else {
        currentParams.delete("search");
      }

      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams, search]
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
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("page", "1"); // Reset page to 1

      if (search) {
        newParams.set("search", search);
      } else {
        newParams.delete("search"); // Remove search param if search is empty
      }

      router.replace(`?${newParams.toString()}`);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  return (
    <>
      <div className="flex justify-between">
        <h1>Users</h1>

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
          <Input
            name="search"
            value={search}
            onChange={onInputChange}
            className="bg-white shadow-sm min-w-[220px]"
            placeholder="Search..."
          />
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
                onEdit={isAdmin ? () => onEditClick(user) : undefined}
                onDelete={isAdmin ? () => onDeleteClick(user) : undefined}
                onSelect={isAdmin ? () => onSelect(user) : undefined}
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
