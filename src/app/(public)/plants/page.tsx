import { Suspense } from "react";
import Spinner from "@/components/spinner";
import PlantsList from "@/components/plantsList";

export default function PlantsListPage() {
  return (
    <Suspense fallback={<Spinner className="my-5" />}>
      <PlantsList />
    </Suspense>
  );
}
