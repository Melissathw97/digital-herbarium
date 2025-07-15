"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserVerifiedModal from "@/components/modals/userVerified";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UsersSignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const confirmedParam = searchParams.get("confirmed");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    router.push("/dashboard");
  };

  useEffect(() => {
    if (confirmedParam === "true") {
      setIsModalOpen(true);
    }
  }, [confirmedParam]);

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

    const { email, password } = formValues;

    supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then(({ error }) => {
        setIsLoading(false);

        if (error) throw error.message;
        router.push("/dashboard");
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
            <h1>Welcome</h1>
            <p className="text-gray-500">
              Enter your credentials to access the digital herbarium
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <Input type="email" name="email" onChange={onInputChange} />
            </div>
            <div className="flex flex-col gap-2">
              <label>Password</label>
              <Input type="password" name="password" onChange={onInputChange} />
            </div>
          </div>

          <div className="flex flex-col gap-4 font-medium text-center">
            <Button
              type="submit"
              disabled={
                Object.values(formValues).some((value) => !value) || isLoading
              }
            >
              Sign In
            </Button>
            <p>
              Don't have an account yet?&nbsp;
              <Link href="/users/sign-up" className="text-lime-800">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      <UserVerifiedModal open={isModalOpen} toggle={toggleModal} />
    </>
  );
}
