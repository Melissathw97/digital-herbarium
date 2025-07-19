"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { LoaderCircle } from "lucide-react";
import UserCard from "@/components/cards/user";
import { getUsers } from "@/services/userServices";
import UserDeleteModal from "@/components/modals/userDelete";
import UserRoleUpdateModal from "@/components/modals/userRoleUpdate";

export default function MembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onEditClick = (user: User) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const onDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Users</h1>

      {isLoading && <LoaderCircle className="animate-spin mx-auto my-4" />}
      {hasError && (
        <p className="text-center text-gray-600 text-xs">
          Unable to fetch users. Please try again later.
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            name={`${user.firstName} ${user.lastName}`}
            role={user.role}
            email={user.email}
            dateJoined={user.joinedAt}
            currentUser={user.id === "1"}
            onEdit={() => onEditClick(user)}
            onDelete={() => onDeleteClick(user)}
          />
        ))}
      </div>

      <UserRoleUpdateModal
        user={selectedUser}
        open={isUpdateModalOpen}
        toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
      />

      <UserDeleteModal
        user={selectedUser}
        open={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
      />
    </>
  );
}
