"use client";

import { Suspense } from "react";
import Spinner from "@/components/spinner";
import PlantsList from "@/components/plants/plantsList";
import { useRouter, useSearchParams } from "next/navigation";
import PublishedList from "@/components/plants/publishedList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Pages } from "@/types/pages";
import { Import, ScanText, Sparkles } from "lucide-react";
import { useAuth } from "@/utils/supabase/tokenStorage";

function TabbedContent() {
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
  );
}

export default function PlantsListPage() {
  const router = useRouter();
  const { isMember } = useAuth();
  return (
    <>
      <div className="flex justify-between">
        <h1>Plant Collection</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">Add Plant</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              router.push(`${Pages.PLANTS_NEW_OCR}?action_type=ocr`)
            }}>
              <ScanText /> Scan with OCR
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              router.push(`${Pages.PLANTS_NEW_AI}?action_type=ai-detection`)
            }}>
              <Sparkles /> AI Detection
            </DropdownMenuItem>
            {!isMember && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                router.push(`${Pages.PLANTS_NEW_IMPORT}`)
              }}>
                <Import /> Import Data
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Suspense fallback={<Spinner className="my-5" />}>
        <TabbedContent />
      </Suspense>
    </>
  );
}
