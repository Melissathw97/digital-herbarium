import { Suspense } from "react";
import Spinner from "@/components/spinner";
import ContactSupportForm from "@/components/forms/support";

export default function ContactSupportPage() {
  return (
    <Suspense fallback={<Spinner className="my-5" />}>
      <ContactSupportForm />
    </Suspense>
  );
}
