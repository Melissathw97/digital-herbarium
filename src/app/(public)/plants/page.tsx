"use client";

import { Suspense } from "react";
import Spinner from "@/components/spinner";
import PlantsList from "@/components/plants/plantsList";
import { useRouter, useSearchParams } from "next/navigation";
import PublishedList from "@/components/plants/publishedList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlantsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const tabs = [
    { label: "Published", component: <PublishedList /> },
    { label: "All Records", component: <PlantsList /> },
  ];

  const onTabClick = (label: string) => {
    router.push(`?tab=${label}`);
  };

  return (
    <>
      <h1>Plant Collection</h1>

      <Suspense fallback={<Spinner className="my-5" />}>
        <Tabs defaultValue={tab || "Published"}>
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
