"use client";

import { useCallback, useEffect, useState } from "react";
import { User } from "@/types/user";
import Spinner from "@/components/spinner";
import { Input } from "@/components/ui/input";
import UserCard from "@/components/cards/user";
import UserDeleteModal from "@/components/modals/userDelete";
import { getUserProfile, getUsers } from "@/services/userServices";
import UserRoleUpdateModal from "@/components/modals/userRoleUpdate";

export default function MembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const fetchUsers = (search?: string) => {
    setIsLoading(true);

    getUsers({ search: search || "" })
      .then(async (data) => {
        setUsers(data);

        const current = await getUserProfile();
        setCurrentUser(current);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
        setIsLoading(false);
      });
  };

  const onEditClick = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const onDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <h1>Users</h1>

        <div className="ml-auto flex gap-2">
          <Input
            type="email"
            name="email"
            onChange={onInputChange}
            className="bg-white shadow-sm min-w-[220px]"
            placeholder="Search..."
          />
        </div>
      </div>

      {hasError && (
        <p className="text-center text-gray-600 text-xs">
          Unable to fetch users. Please try again later.
        </p>
      )}

      {isLoading ? (
        <Spinner className="my-5" />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              name={`${user.firstName} ${user.lastName}`}
              role={user.role}
              email={user.email}
              dateJoined={user.joinedAt}
              currentUser={user.id === currentUser?.id}
              onEdit={() => onEditClick(user)}
              onDelete={() => onDeleteClick(user)}
            />
          ))}
        </div>
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
    </>
  );
}
