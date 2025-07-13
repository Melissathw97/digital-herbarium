"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { Plant } from "@/types/plant";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PlantsListPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <h1>Plant Collection</h1>

      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5">
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm">
            Export to CSV
          </Button>
          <Link href="/plants/new">
            <Button size="sm">Add Plant</Button>
          </Link>
        </div>

        <div className="rounded-md border overflow-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3"></th>
                <th className="p-3">Family</th>
                <th className="p-3">Species</th>
                <th className="p-3">Barcode</th>
                <th className="p-3">Prefix</th>
                <th className="p-3">Number</th>
                <th className="p-3">Collector</th>
                <th className="p-3">Date</th>
                <th className="p-3">State</th>
                <th className="p-3">District</th>
                <th className="p-3">Location</th>
                <th className="p-3">Vernacular Name</th>
              </tr>
            </thead>
            <tbody>
              {plants.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-3 text-center text-gray-500">
                    No plants found.
                  </td>
                </tr>
              ) : (
                plants.map((plant, index) => (
                  <tr key={plant.id}>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{plant.family}</td>
                    <td className="p-3">{plant.species}</td>
                    <td className="p-3">{plant.barCode}</td>
                    <td className="p-3">{plant.prefix}</td>
                    <td className="p-3">{plant.number}</td>
                    <td className="p-3">{plant.collector}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs">
          <p>Showing 1 - 10 of 100 items</p>
          <div className="border rounded-sm flex items-center gap-1 px-1 py-1">
            <button className="w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs">
              <ChevronLeft className="w-3 h-3" />
            </button>
            {[1, 2, 3].map((number) => (
              <button
                key={number}
                className={`${number === currentPage ? "bg-lime-700/20" : ""} w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs`}
              >
                {number}
              </button>
            ))}
            <button className="w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
