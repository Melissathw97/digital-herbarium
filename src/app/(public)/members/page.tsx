import { Suspense } from "react";
import Spinner from "@/components/spinner";
import MembersList from "@/components/membersList";

export default function MembersPage() {
  return (
    <Suspense fallback={<Spinner className="my-5" />}>
      <MembersList />
    </Suspense>
  );
}
