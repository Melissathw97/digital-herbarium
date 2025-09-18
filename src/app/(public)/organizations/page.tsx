import { Suspense } from "react";
import Spinner from "@/components/spinner";
import OrganizationList from "@/components/organizations/organizationList";

export default function ListPage() {
  return (
    <>
      <h1>Organizations</h1>

      <Suspense fallback={<Spinner className="my-5" />}>
        <OrganizationList />
      </Suspense>
    </>
  );
}
