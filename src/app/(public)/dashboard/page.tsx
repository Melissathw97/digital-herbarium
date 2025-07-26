"use client";

import StateChart from "@/components/cards/stateChart";
import FamilyChart from "@/components/cards/familyChart";
import MonthChart from "@/components/cards/monthChart";
import { Gauge, ScanText, Sparkles, Sprout } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <h1>Welcome</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <Sprout className="text-lime-700" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">Total Records</p>
            <p className="font-bold text-xl">1,309</p>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <ScanText className="text-lime-700" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">OCR Records</p>
            <p className="font-bold text-xl">513</p>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <Sparkles className="text-lime-700" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">AI Detected Records</p>
            <p className="font-bold text-xl">796</p>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex gap-4 items-center">
          <Gauge className="text-lime-700" />
          <div className="flex flex-col gap-1">
            <p className="text-lime-700 font-semibold">Average Confidence</p>
            <p className="font-bold text-xl">76%</p>
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
