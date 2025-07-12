import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function UsersLogin() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <Image src="/asm-logo.png" alt="ASM Logo" width={100} height={40} />
      <div className="flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-1">
          <h1>Welcome</h1>
          <p className="text-gray-500">
            Enter your credentials to access the digital herbarium
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="font-medium">Email</p>
            <Input type="email" className="text-center" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Password</p>
            <Input type="password" className="text-center" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button>Sign In</Button>
          <p>Don't have an account yet?</p>
        </div>
      </div>
    </div>
  );
}
