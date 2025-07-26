"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import Spinner from "@/components/spinner";
import UserCard from "@/components/cards/user";
import UserDeleteModal from "@/components/modals/userDelete";
import { getUserProfile, getUsers } from "@/services/userServices";
import UserRoleUpdateModal from "@/components/modals/userRoleUpdate";

export default function MembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchUsers = () => {
    setIsLoading(true);

    getUsers()
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
      <h1>Users</h1>

      {hasError && (
        <p className="text-center text-gray-600 text-xs">
          Unable to fetch users. Please try again later.
        </p>
      )}

      {isLoading ? (
        <Spinner className="my-5" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
