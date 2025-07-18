"use client";

import BurseraceaeChart from "@/components/cards/burseraceaeChart";
import DipterocarpaceaeChart from "@/components/cards/dipterocarpaceaeChart";
import DataCollectionChart from "@/components/cards/DataCollectionChart";

export default function DashboardPage() {
  return (
    <>
      <h1>Welcome</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex flex-col gap-1 justify-center">
          <p className="font-semibold">Total Plants</p>
          <p className="font-bold text-xl">1,309</p>
        </div>
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex flex-col gap-1">
          <p className="font-semibold uppercase text-lime-700 text-xs mb-3">
            Burseraceae
          </p>
          <div className="flex">
            <div className="flex-1">
              <p className="font-semibold">Total</p>
              <p className="font-bold text-xl">564</p>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Genus</p>
              <p className="font-bold text-xl">
                3 <span className="text-xs text-gray-500">/ 4</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex flex-col gap-1">
          <p className="font-semibold uppercase text-lime-700 text-xs mb-3">
            Dipterocarpaceae
          </p>
          <div className="flex">
            <div className="flex-1">
              <p className="font-semibold">Total</p>
              <p className="font-bold text-xl">745</p>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Genus</p>
              <p className="font-bold text-xl">
                5 <span className="text-xs text-gray-500">/ 9</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <BurseraceaeChart />
        <DipterocarpaceaeChart />
        <DataCollectionChart />
      </div>
    </>
  );
}
