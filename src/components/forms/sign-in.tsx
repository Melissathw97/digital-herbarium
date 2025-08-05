"use client";

import { ChangeEvent, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Pages } from "@/types/pages";
import { BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  userSignIn,
  userResendConfirmationEmail,
} from "@/services/authServices";
import { useSearchParams, useRouter } from "next/navigation";
import UserResendEmailModal from "../modals/userResendEmail";
import UserPendingVerificationModal from "../modals/userPendingVerification";

export default function UsersSignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [isSentModalOpen, setIsSentModalOpen] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);

  const searchParams = useSearchParams();
  const confirmedParam = searchParams.get("confirmed");
  const emailParam = searchParams.get("email");
  const errorCode = searchParams.get("error_code");

  const [showVerified, setShowVerified] = useState(false);

  useEffect(() => {
    if (errorCode === "otp_expired") {
      setIsResendModalOpen(true);
    } else if (confirmedParam === "true") {
      setShowVerified(true);
    }
  }, [errorCode, confirmedParam]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    const { email, password } = formValues;

    userSignIn({ email, password })
      .then(({ error }) => {
        if (error) throw error.message;
        router.push(Pages.DASHBOARD);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error);
      });
  };

  const onModalConfirm = () => {
    if (emailParam) {
      setIsLoadingResend(true);
      userResendConfirmationEmail({ email: emailParam })
        .then(({ error }) => {
          if (error) throw error.message;

          setIsResendModalOpen(false);
          setIsSentModalOpen(true);
          setIsLoadingResend(false);
        })
        .catch((error) => {
          setIsLoadingResend(false);
          console.error("error", error);
          toast.error(
            error || "Request failed. Please try again in a few minutes."
          );
        });
    } else {
      toast.error(
        "Email not found. Please click on the link in your inbox again."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center">
        <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
        <form onSubmit={onSubmit} className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-1 text-center">
            <h1>Welcome</h1>
            <p className="text-gray-500">
              Enter your credentials to access the digital herbarium
            </p>
          </div>

          {showVerified ? (
            <div className="bg-lime-700/20 text-xs rounded-sm p-2.5 px-4 text-lime-800 flex gap-2">
              <BadgeCheck className="w-5 h-5" />
              <div className="flex flex-col gap-1 mt-0.5">
                <p className="font-semibold">Account successfully verified.</p>
                <p>Please sign in to access the digital herbarium. Enjoy!</p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <Input type="email" name="email" onChange={onInputChange} />
            </div>
            <div className="flex flex-col gap-2">
              <label>Password</label>
              <Input type="password" name="password" onChange={onInputChange} />
              <Link href={Pages.RESET_PASSWORD} className="mt-1 inline ml-auto">
                <Button type="button" variant="link" size="sm">
                  Forgot Password?
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 font-medium text-center">
            <Button
              type="submit"
              disabled={
                Object.values(formValues).some((value) => !value) || isLoading
              }
            >
              {isLoading ? "Signing In" : "Sign In"}
            </Button>
            <p>
              Don&apos;t have an account yet?&nbsp;
              <Link href={Pages.SIGN_UP}>
                <Button variant="link">Sign up here</Button>
              </Link>
            </p>
          </div>
        </form>
      </div>

      <UserResendEmailModal
        open={isResendModalOpen}
        isLoading={isLoadingResend}
        onConfirm={onModalConfirm}
      />

      <UserPendingVerificationModal
        open={isSentModalOpen}
        onConfirm={() => setIsSentModalOpen(false)}
      />
    </>
  );
}
