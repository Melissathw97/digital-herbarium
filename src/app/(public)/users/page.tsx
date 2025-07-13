"use client";

import UserCard from "@/components/cards/user";

export default function DashboardPage() {
  return (
    <>
      <h1>Users</h1>

      <div className="grid grid-cols-4 gap-4">
        <UserCard
          name="Melissa"
          role="admin"
          email="melissa@test.com"
          dateJoined="13 July 2025"
        />
        <UserCard
          name="Ammar"
          role="admin"
          email="ammar321an@gmail.com"
          dateJoined="01 July 2025"
        />
        <UserCard
          name="Melissa"
          role="member"
          email="melissathw97@gmail.com"
          dateJoined="21 June 2025"
        />
      </div>
    </>
  );
}
