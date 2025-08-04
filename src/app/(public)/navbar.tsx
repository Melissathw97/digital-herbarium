"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { User, UserRole } from "@/types/user";
import { Pages } from "@/types/pages";
import { Button } from "@/components/ui/button";
import { userSignOut } from "@/services/authServices";
import { usePathname, useRouter } from "next/navigation";
import {
  Crown,
  Home,
  Sprout,
  UserCircle,
  UsersRound,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserProfile } from "@/services/userServices";
import Badge from "@/components/badge";

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

        <div className="flex gap-4">
          {user &&
            (user.role === UserRole.ADMIN ? (
              <Badge variant="purple">
                <Crown />
                Admin
              </Badge>
            ) : (
              <Badge>
                <UserIcon />
                Member
              </Badge>
            ))}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserCircle />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={Pages.PROFILE}>
                <DropdownMenuItem className="cursor-pointer">
                  My Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={onLogOutClick}
                className="text-red-800 cursor-pointer"
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
