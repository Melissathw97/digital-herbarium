"use client";

import Link from "next/link";
import { Plant } from "@/types/plant";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

const mockPlantData: Plant[] = [
  {
    id: "1",
    family: "Burseraceae",
    genus: "Canarium",
    species: "Canarium odontophyllum",
    barCode: "BR001",
    prefix: "BR",
    number: "001",
    collector: "Dr. Lim Chee Wah",
    date: "2024-03-12",
    state: "Sarawak",
    district: "Kuching",
    location: "Semenggoh Nature Reserve",
    vernacularName: "Dabai",
  },
  {
    id: "2",
    family: "Dipterocarpaceae",
    genus: "Shorea",
    species: "Shorea leprosula",
    barCode: "DP002",
    prefix: "DP",
    number: "002",
    collector: "Nur Farah Aina",
    date: "2024-06-21",
    state: "Pahang",
    district: "Jerantut",
    location: "Taman Negara",
    vernacularName: "Meranti Tembaga",
  },
  {
    id: "3",
    family: "Burseraceae",
    genus: "Santiria",
    species: "Santiria laevigata",
    barCode: "BR003",
    prefix: "BR",
    number: "003",
    collector: "Tan Wei Lun",
    date: "2023-11-05",
    state: "Sabah",
    district: "Tambunan",
    location: "Crocker Range Park",
    vernacularName: "Kekatong",
  },
  {
    id: "4",
    family: "Dipterocarpaceae",
    genus: "Dipterocarpus",
    species: "Dipterocarpus grandiflorus",
    barCode: "DP004",
    prefix: "DP",
    number: "004",
    collector: "Aisyah Rahman",
    date: "2024-08-09",
    state: "Selangor",
    district: "Hulu Langat",
    location: "Bukit Broga",
    vernacularName: "Keruing",
  },
  {
    id: "5",
    family: "Burseraceae",
    genus: "Dacryodes",
    species: "Dacryodes rostrata",
    barCode: "BR005",
    prefix: "BR",
    number: "005",
    collector: "Mohd Iqbal Zain",
    date: "2024-01-17",
    state: "Johor",
    district: "Mersing",
    location: "Endau-Rompin National Park",
    vernacularName: "Engkala",
  },
];

export default function PlantsListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const headers: { label: string; dataKey: keyof Plant }[] = [
    { label: "Date", dataKey: "date" },
    { label: "Family", dataKey: "family" },
    { label: "Genus", dataKey: "genus" },
    { label: "Species", dataKey: "species" },
    { label: "Barcode", dataKey: "barCode" },
    // { label: "Prefix", dataKey: "prefix" },
    // { label: "Number", dataKey: "number" },
    { label: "Collector", dataKey: "collector" },
    { label: "State", dataKey: "state" },
    { label: "District", dataKey: "district" },
    { label: "Location", dataKey: "location" },
    { label: "Vernacular Name", dataKey: "vernacularName" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    setTimeout(() => {
      setPlants(mockPlantData);
      setIsLoading(false);
    }, 1200);
  });

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
                <th className="p-3">
                  <Input type="checkbox" />
                </th>
                {headers.map(({ label }) => (
                  <th key={label} className="p-3 whitespace-nowrap">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="p-3 text-gray-500"
                  >
                    <LoaderCircle className="animate-spin mx-auto" />
                  </td>
                </tr>
              ) : plants.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="p-3 text-center text-gray-500"
                  >
                    No plants found.
                  </td>
                </tr>
              ) : (
                plants.map((plant, index) => (
                  <tr key={plant.id}>
                    <td className={index % 2 ? "bg-gray-100" : ""}>
                      <Input type="checkbox" className="mx-auto" />
                    </td>
                    {headers.map(({ dataKey }) => (
                      <td
                        key={dataKey}
                        className={`p-4 whitespace-nowrap ${index % 2 ? "bg-gray-100" : ""}`}
                      >
                        {dataKey === "date"
                          ? formatDate(plant[dataKey])
                          : plant[dataKey]}
                      </td>
                    ))}
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
