"use client";

import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Log } from "@/types/user";
import { Pages } from "@/types/pages";
import Spinner from "@/components/spinner";
import { Pagination } from "@/types/plant";
import ActivityLogs from "@/components/users/activityLogs";
import { useRouter, useSearchParams } from "next/navigation";
import { getPlantLogs, getUserLogs } from "@/services/auditServices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuditLogsPage() {
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

  const fetchPlantLogs = async () => {
    setIsLoading(true);

    try {
      const page = searchParams.get("page");
      const limit = searchParams.get("limit");
      const search = searchParams.get("search");
      const action = searchParams.get("action");

      const queryParams = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search || "",
        action: action || "",
      };

      const response = await getPlantLogs(queryParams);

      setLogs(response.data);
      setPagination(response.pagination);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch plant logs. Please try again later.");
      setIsLoading(false);
    }
  };

  const fetchUserLogs = async () => {
    setIsLoading(true);

    try {
      const page = searchParams.get("page");
      const limit = searchParams.get("limit");
      const search = searchParams.get("search");
      const action = searchParams.get("action");

      const queryParams = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search || "",
        action: action || "",
      };

      const response = await getUserLogs(queryParams);

      setLogs(response.data);
      setPagination(response.pagination);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch plant logs. Please try again later.");
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      label: "Plants",
      component: (
        <ActivityLogs
          fetchLogs={fetchPlantLogs}
          logs={logs}
          isLoading={isLoading}
          pagination={pagination}
        />
      ),
    },
    {
      label: "Users",
      component: (
        <ActivityLogs
          fetchLogs={fetchUserLogs}
          logs={logs}
          isLoading={isLoading}
          pagination={pagination}
          link={`${Pages.MEMBERS}`}
        />
      ),
    },
  ];

  const onTabClick = (label: string) => {
    router.push(`?tab=${label}`);
  };

  return (
    <>
      <h1>Audit Logs</h1>

      <Suspense fallback={<Spinner className="my-5" />}>
        <Tabs defaultValue={tab || "Plants"}>
          <TabsList className="w-full p-0 bg-transparent justify-start border-b rounded-none">
            {tabs.map(({ label }) => (
              <TabsTrigger
                key={label}
                value={label}
                onClick={() => onTabClick(label)}
                className="flex-0 px-4 rounded-none data-[state=active]:bg-transparent h-full data-[state=active]:shadow-none data-[state=active]:text-lime-700 border-b-2 border-transparent data-[state=active]:border-b-lime-700"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(({ label, component }) => (
            <TabsContent key={label} value={label}>
              {component}
            </TabsContent>
          ))}
        </Tabs>
      </Suspense>
    </>
  );
}
