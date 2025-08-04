import { Suspense } from "react";
import Spinner from "@/components/spinner";
import UsersSignInForm from "@/components/forms/sign-in";

export default function UsersSignIn() {
  return (
    <Suspense fallback={<Spinner className="my-5" />}>
      <UsersSignInForm />
    </Suspense>
  );
}
