"use client";

import { Suspense } from "react";
import Spinner from "@/components/spinner";
import AccountInfo from "@/components/profile/accountInfo";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserContributionChart from "@/components/cards/userContributionChart";
import UserActivityLogs from "@/components/users/activityLogs";

export default function MembersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const tabs = [
    { key: "account-info", label: "Account Info", component: <AccountInfo /> },
    {
      key: "activity-log",
      label: "Activity Log",
      component: (
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <UserContributionChart />
          <UserActivityLogs />
        </div>
      ),
    },
  ];

  const onTabClick = (key: string) => {
    router.push(`?tab=${key}`);
  };

  return (
    <>
      <h1>My Profile</h1>

      <Suspense fallback={<Spinner className="my-5" />}>
        <div>
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
        </div>
      </Suspense>
    </>
  );
}
