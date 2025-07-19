"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import UserPendingVerificationModal from "@/components/modals/userPendingVerification";

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onModalConfirm = () => {
    router.push("/users/sign-in");
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

    const supabase = createClient();

    const { firstName, lastName, email, password, confirmPassword } =
      formValues;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    supabase.auth
      .signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/users/sign-in?confirmed=true`,
        },
      })
      .then(({ error }) => {
        setIsLoading(false);

        if (error) throw error.message;
        toggleModal();
      })
      .catch((error) => {
        alert(error);
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
            <div className="flex gap-4">
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
              Sign Up
            </Button>
            <p>
              Already have an account?&nbsp;
              <Link href="/users/sign-in" className="text-lime-800">
                Sign in here
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
