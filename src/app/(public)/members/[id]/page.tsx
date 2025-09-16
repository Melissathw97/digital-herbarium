"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { ChevronLeftIcon } from "lucide-react";
import { getUserById } from "@/services/userServices";
import { useRouter, useParams } from "next/navigation";
import UserActivityLogs from "@/components/users/activityLogs";
import UserContributionChart from "@/components/cards/userContributionChart";

export default function MemberDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserById({ id: params.id?.toString() || "" })
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.id]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => router.back()}
            className="hover:bg-gray-200 p-1 rounded-full"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {!isLoading && user && (
            <h2>
              {user.firstName} {user.lastName}
            </h2>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <UserContributionChart />
        <UserActivityLogs />
      </div>
    </>
  );
}
