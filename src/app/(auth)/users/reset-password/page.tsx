"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pages } from "@/types/pages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userResetPassword } from "@/services/authServices";
import UserResetPasswordModal from "@/components/modals/userResetPassword";

export default function UsersResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

    const { email } = formValues;

    userResetPassword({ email })
      .then(({ error }) => {
        if (error) throw error.message;
        toggleModal();
      })
      .catch((error) => {
        setIsLoading(false);
        alert(error);
      });
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
      <form onSubmit={onSubmit} className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-1 text-center">
          <h1>Reset Password</h1>
          <p className="text-gray-500">
            It happens to the best of us. Enter your email to get a reset link.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <Input type="email" name="email" onChange={onInputChange} />
          </div>
        </div>

        <div className="flex flex-col gap-4 font-medium text-center">
          <Button
            type="submit"
            disabled={
              Object.values(formValues).some((value) => !value) || isLoading
            }
          >
            Send Reset Link
          </Button>
          <p>
            <Link href={Pages.SIGN_IN}>
              <Button variant="link">Back to sign in</Button>
            </Link>
          </p>
        </div>
      </form>

      <UserResetPasswordModal open={isModalOpen} />
    </div>
  );
}
