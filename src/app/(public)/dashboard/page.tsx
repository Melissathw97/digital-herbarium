"use client";

import { useEffect, useState } from "react";
import { Summary } from "@/types/dashboard";
import StateChart from "@/components/cards/stateChart";
import FamilyChart from "@/components/cards/familyChart";
import MonthChart from "@/components/cards/monthChart";
import { getSummary } from "@/services/dashboardServices";
import { Import, ScanText, Sparkles, Sprout } from "lucide-react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary>();

  useEffect(() => {
    getSummary().then((response) => {
      setSummary(response);
    });
  }, []);
  return (
    <>
      <h1>Welcome</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <Sprout className="text-lime-700 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">Published Records</p>
            <p className="font-bold text-xl">{summary?.total || "-"}</p>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <ScanText className="text-lime-700 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">OCR Records</p>
            <p className="font-bold text-xl">{summary?.totalOcr || "-"}</p>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <Sparkles className="text-lime-700 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">AI Detected Records</p>
            <p className="font-bold text-xl">{summary?.totalAi || "-"}</p>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <Import className="text-lime-700 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">Imported Records</p>
            <p className="font-bold text-xl">{summary?.totalImported || "-"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <FamilyChart />
        <StateChart />
        <MonthChart />
      </div>
    </>
  );
}
