"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Log, User } from "@/types/user";
import { Pagination } from "@/types/plant";
import Spinner from "@/components/spinner";
import { ChevronLeftIcon } from "lucide-react";
import ActivityLogs from "@/components/users/activityLogs";
import { getActivityLogs, getUserById } from "@/services/userServices";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import UserContributionChart from "@/components/cards/userContributionChart";

export default function MemberDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User>();
  const [logs, setLogs] = useState<Log[]>([]);

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const page = searchParams.get("page");
      const limit = searchParams.get("limit");

      const queryParams = {
        profileId: user?.profileId || "",
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      };

      const response = await getActivityLogs(queryParams);

      setLogs(response.data);
      setPagination(response.pagination);
      setIsLoading(false);
    } catch {
      toast.error("Failed to fetch user activity. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserById({ id: params.id?.toString() || "" })
      .then((data) => {
        setUser(data);
        setIsUserLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsUserLoading(false);
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

      {isUserLoading ? (
        <div className="bg-white shadow-sm rounded-sm px-4 py-16 border flex flex-col gap-5 w-full overflow-hidden">
          <Spinner />
        </div>
      ) : !isUserLoading && !user ? (
        <div className="bg-white shadow-sm rounded-sm px-4 py-8 border flex flex-col gap-5 w-full">
          <p className="text-center text-gray-600 text-xs">No user found.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <UserContributionChart profileId={user?.profileId || ""} />
          <ActivityLogs
            fetchLogs={fetchData}
            logs={logs}
            isLoading={isLoading}
            pagination={pagination}
          />
        </div>
      )}
    </>
  );
}
