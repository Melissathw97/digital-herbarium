"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UsersSignUp() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, confirmPassword } = formValues;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("SUBMIT", formValues);
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
      <form onSubmit={onSubmit} className="flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-1">
          <h1>Create New Account</h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-4">
            <div className="w-full flex flex-col gap-2">
              <p className="font-medium">First Name</p>
              <Input
                name="firstName"
                onChange={onInputChange}
                className="text-center"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <p className="font-medium">Last Name</p>
              <Input
                name="lastName"
                onChange={onInputChange}
                className="text-center"
              />
            </div>
          </div>
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
          <div className="flex flex-col gap-2">
            <p className="font-medium">Confirm Password</p>
            <Input
              type="password"
              name="confirmPassword"
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
            Sign Up
          </Button>
          <p>
            Already have an account?&nbsp;
            <Link href="/users/sign-in">Sign in here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
