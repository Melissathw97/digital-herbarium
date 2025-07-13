"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UsersLogin() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
      <form className="flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-1">
          <h1>Welcome</h1>
          <p className="text-gray-500">
            Enter your credentials to access the digital herbarium
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="font-medium">Email</p>
            <Input
              type="email"
              name="email"
              onChange={onInputChange}
              className="text-center"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Password</p>
            <Input
              type="password"
              name="password"
              onChange={onInputChange}
              className="text-center"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={!formValues.email || !formValues.password}
          >
            Sign In
          </Button>
          <p>
            Don't have an account yet?&nbsp;
            <Link href="/users/sign-up">Sign up here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
