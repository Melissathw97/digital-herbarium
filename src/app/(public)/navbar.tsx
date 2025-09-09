"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { User } from "@/types/user";
import { Pages } from "@/types/pages";
import { Button } from "@/components/ui/button";
import { userSignOut } from "@/services/authServices";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserRoleBadge from "@/components/userRoleBadge";
import { getUserProfile } from "@/services/userServices";
import { FileClock, Home, Sprout, UserCircle, UsersRound } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User>();

  const onLogOutClick = async () => {
    userSignOut()
      .then(({ error }) => {
        if (error) throw error;
        router.push(Pages.SIGN_IN);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <nav className="fixed z-10 bg-white p-5 py-4 border-b w-screen">
      <div className="max-w-6xl mx-auto flex gap-8 items-center justify-between">
        <Image src="/asm-logo.png" alt="ASM Logo" width={70} height={30} />
        <div className="flex gap-2 w-full">
          <Link href={Pages.DASHBOARD}>
            <Button
              variant={pathname === Pages.DASHBOARD ? "secondary" : "ghost"}
              size="sm"
            >
              <Home />
              Home
            </Button>
          </Link>
          <Link href={Pages.PLANTS}>
            <Button
              variant={
                pathname.startsWith(Pages.PLANTS) ? "secondary" : "ghost"
              }
              size="sm"
            >
              <Sprout />
              Plants
            </Button>
          </Link>
          <Link href={Pages.APPROVALS}>
            <Button
              variant={
                pathname.startsWith(Pages.APPROVALS) ? "secondary" : "ghost"
              }
              size="sm"
            >
              <FileClock />
              Approvals
            </Button>
          </Link>
          <Link href={Pages.MEMBERS}>
            <Button
              variant={pathname === Pages.MEMBERS ? "secondary" : "ghost"}
              size="sm"
            >
              <UsersRound />
              Users
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 shrink-0">
          {user && <UserRoleBadge user={user} />}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserCircle />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex px-2 py-2 gap-3 w-56">
                <div
                  className="size-9 rounded-full text-gray-600 grid place-items-center font-semibold shrink-0 shadow-sm"
                  style={{
                    backgroundColor:
                      user?.organizations?.colourCode || "lightgrey",
                  }}
                >
                  {user?.firstName.substring(0, 1)}
                </div>

                <div className="flex flex-col gap-0.5 overflow-hidden w-full">
                  {user ? (
                    <>
                      <p className="font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {user?.email}
                      </p>
                      <p className="text-xs whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {user?.organizations?.name}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <div className="bg-gray-200 h-4.5 w-full rounded-sm"></div>
                      <div className="bg-gray-200 h-3 w-full rounded-sm"></div>
                      <div className="bg-gray-200 h-3 w-full rounded-sm"></div>
                    </div>
                  )}
                </div>
              </div>
              <hr className="my-1" />
              <Link href={Pages.PROFILE}>
                <DropdownMenuItem className="cursor-pointer px-3 py-2">
                  My Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={onLogOutClick}
                className="text-red-800 cursor-pointer px-3 py-2"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
