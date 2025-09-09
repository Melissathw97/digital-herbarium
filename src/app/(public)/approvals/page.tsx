import { Suspense } from "react";
import Spinner from "@/components/spinner";
import ApprovalsList from "@/components/approvalsList";

export default function ApprovalsPage() {
  return (
    <>
      <h1>Approvals</h1>

      <Suspense fallback={<Spinner className="my-5" />}>
        <ApprovalsList />
      </Suspense>
    </>
  );
}
