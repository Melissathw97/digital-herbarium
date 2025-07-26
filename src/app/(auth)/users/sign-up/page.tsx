"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Pages } from "@/types/pages";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { userSignUp } from "@/services/authServices";
import { PasswordValidationResult } from "@/types/password";
import UserPendingVerificationModal from "@/components/modals/userPendingVerification";
import {
  passwordValidationMessage,
  validatePassword,
} from "@/utils/password-validation";

export default function UsersSignUp() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const passwordValidation: PasswordValidationResult = useMemo(() => {
    return validatePassword(formValues.password);
  }, [formValues]);

  const isSubmitButtonDisabled = useMemo(() => {
    if (isLoading) return true;
    if (Object.values(formValues).some((value) => !value)) return true;
    if (formValues.password !== formValues.confirmPassword) return true;
    if (Object.values(passwordValidation).some((isFulfilled) => !isFulfilled))
      return true;

    return false;
  }, [isLoading, formValues, passwordValidation]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onModalConfirm = () => {
    router.push(Pages.SIGN_IN);
  };

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

    const { firstName, lastName, email, password } = formValues;

    userSignUp({ email, password, firstName, lastName })
      .then(({ error }) => {
        setIsLoading(false);

        if (error) throw error.message;
        toggleModal();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center">
        <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
        <form onSubmit={onSubmit} className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-1 text-center">
            <h1>Create New Account</h1>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <label>First Name</label>
                <Input name="firstName" onChange={onInputChange} />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label>Last Name</label>
                <Input name="lastName" onChange={onInputChange} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <Input type="email" name="email" onChange={onInputChange} />
            </div>
            <div className="flex flex-col gap-2">
              <label>Password</label>
              <Input type="password" name="password" onChange={onInputChange} />
              {formValues.password && (
                <div className="text-[10px] flex flex-col gap-0.5">
                  {(
                    Object.entries(passwordValidation) as [
                      keyof PasswordValidationResult,
                      boolean,
                    ][]
                  ).map(([key, isFulfilled]) => (
                    <p
                      key={key}
                      className={`${isFulfilled ? "text-green-700" : "text-red-700"} flex gap-2 items-center px-1`}
                    >
                      {isFulfilled ? (
                        <Check className="size-3" />
                      ) : (
                        <X className="size-3" />
                      )}
                      {passwordValidationMessage[key]}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label>Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                onChange={onInputChange}
              />
              {formValues.confirmPassword &&
                formValues.password !== formValues.confirmPassword && (
                  <p className="text-red-700 text-[10px] px-1">
                    Passwords do not match
                  </p>
                )}
            </div>
          </div>

          <div className="flex flex-col gap-4 font-medium text-center">
            <Button type="submit" disabled={isSubmitButtonDisabled}>
              {isLoading ? "Signing Up" : "Sign Up"}
            </Button>
            <p>
              Already have an account?&nbsp;
              <Link href={Pages.SIGN_IN}>
                <Button variant="link">Sign in here</Button>
              </Link>
            </p>
          </div>
        </form>
      </div>

      <UserPendingVerificationModal
        open={isModalOpen}
        onConfirm={onModalConfirm}
      />
    </>
  );
}
