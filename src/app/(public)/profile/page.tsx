"use client";

import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Log } from "@/types/user";
import { Pagination } from "@/types/plant";
import Spinner from "@/components/spinner";
import AccountInfo from "@/components/profile/accountInfo";
import { useRouter, useSearchParams } from "next/navigation";
import UserActivityLogs from "@/components/users/activityLogs";
import { getActivityLogs, getUserProfile } from "@/services/userServices";
import UserContributionChart from "@/components/cards/userContributionChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TabbedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const onTabClick = (key: string) => {
    router.push(`?tab=${key}`);
  };

  const fetchLogs = async () => {
    try {
      const profileData = await getUserProfile();

      setIsLoading(true);
      const page = searchParams.get("page");
      const limit = searchParams.get("limit");

      const queryParams = {
        profileId: profileData?.profileId ?? undefined,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      };

      const response = await getActivityLogs(queryParams);

      setLogs(response.data);
      setPagination(response.pagination);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch activity logs. Please try again later.");
      setIsLoading(false);
    }
  };

  const tabs = [
    { key: "account-info", label: "Account Info", component: <AccountInfo /> },
    {
      key: "activity-log",
      label: "Activity Log",
      component: (
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <UserContributionChart />
          <UserActivityLogs
            fetchLogs={fetchLogs}
            logs={logs}
            isLoading={isLoading}
            pagination={pagination}
          />
        </div>
      ),
    },
  ];

  return (
    <Tabs defaultValue={tab || "account-info"}>
      <TabsList className="w-full p-0 bg-transparent justify-start border-b rounded-none">
        {tabs.map(({ key, label }) => (
          <TabsTrigger
            key={key}
            value={key}
            onClick={() => onTabClick(key)}
            className="flex-0 px-4 rounded-none data-[state=active]:bg-transparent h-full data-[state=active]:shadow-none data-[state=active]:text-lime-700 border-b-2 border-transparent data-[state=active]:border-b-lime-700"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ key, component }) => (
        <TabsContent key={key} value={key}>
          {component}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default function MembersPage() {
  return (
    <>
      <h1>My Profile</h1>

      <Suspense fallback={<Spinner className="my-5" />}>
        <TabbedContent />
      </Suspense>
    </>
  );
}
