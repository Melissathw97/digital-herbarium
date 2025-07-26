"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Pages } from "@/types/pages";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userUpdatePassword } from "@/services/authServices";
import { PasswordValidationResult } from "@/types/password";
import {
  passwordValidationMessage,
  validatePassword,
} from "@/utils/password-validation";

export default function UsersUpdatePassword() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    userUpdatePassword({ newPassword: formValues.password })
      .then(({ error }) => {
        if (error) throw error.message;
        router.push(Pages.SIGN_IN);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error);
      });
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
      <form onSubmit={onSubmit} className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-1 text-center">
          <h1>Confirm New Password</h1>
        </div>

        <div className="flex flex-col gap-5">
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
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
