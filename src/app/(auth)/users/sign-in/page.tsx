"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UsersSignIn() {
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("SUBMIT", formValues);
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
      <form onSubmit={onSubmit} className="flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-1">
          <h1>Welcome</h1>
          <p className="text-gray-500">
            Enter your credentials to access the digital herbarium
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <Input
              type="email"
              name="email"
              onChange={onInputChange}
              className="text-center"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <Input
              type="password"
              name="password"
              onChange={onInputChange}
              className="text-center"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 font-medium">
          <Button
            type="submit"
            disabled={Object.values(formValues).some((value) => !value)}
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
