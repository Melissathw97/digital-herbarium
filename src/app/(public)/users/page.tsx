"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/cards/user";
import { User } from "@/types/user";
import UserRoleUpdateModal from "@/components/modals/userRoleUpdate";
import UserDeleteModal from "@/components/modals/userDelete";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
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
    setUsers([
      {
        id: "1",
        name: "Melissa",
        role: "super_admin",
        email: "melissa@test.com",
        joinedAt: "13 July 2025",
      },
      {
        id: "2",
        name: "Ammar",
        role: "super_admin",
        email: "ammar321an@gmail.com",
        joinedAt: "01 July 2025",
      },
      {
        id: "3",
        name: "Melissa",
        role: "member",
        email: "melissathw97@gmail.com",
        joinedAt: "24 June 2025",
      },
    ]);
  }, []);

  return (
    <>
      <h1>Users</h1>

      <div className="grid grid-cols-4 gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
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
