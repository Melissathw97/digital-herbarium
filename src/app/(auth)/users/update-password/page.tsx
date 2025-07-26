"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Pages } from "@/types/pages";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userUpdatePassword } from "@/services/authServices";

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    const { password, confirmPassword } = formValues;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    userUpdatePassword({ newPassword: password })
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
          </div>
          <div className="flex flex-col gap-2">
            <label>Confirm Password</label>
            <Input
              type="password"
              name="confirmPassword"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 font-medium text-center">
          <Button
            type="submit"
            disabled={
              Object.values(formValues).some((value) => !value) || isLoading
            }
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
