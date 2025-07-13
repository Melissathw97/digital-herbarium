"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-200 p-1 rounded-full"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <h2>Create New Plant Record</h2>
      </div>

      <div className="bg-white shadow-sm rounded-sm py-5 border flex flex-col gap-5"></div>
    </>
  );
}
