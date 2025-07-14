"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Home, Sprout, UserCircle, UsersRound } from "lucide-react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const onLogOutClick = async () => {
    const supabase = createClient();
    supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) throw error;
        router.push("/users/sign-in");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      {/* Header */}
      <nav className="fixed z-10 bg-white p-5 py-4 border-b w-screen">
        <div className="max-w-6xl mx-auto flex gap-8 items-center justify-between">
          <Image src="/asm-logo.png" alt="ASM Logo" width={70} height={30} />

          <div className="flex gap-2 w-full">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
              >
                <Home />
                Home
              </Button>
            </Link>
            <Link href="/plants">
              <Button
                variant={pathname.startsWith("/plants") ? "secondary" : "ghost"}
                size="sm"
              >
                <Sprout />
                Plants
              </Button>
            </Link>
            <Link href="/users">
              <Button
                variant={pathname === "/users" ? "secondary" : "ghost"}
                size="sm"
              >
                <UsersRound />
                Users
              </Button>
            </Link>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserCircle />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
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

      {/* Content */}
      <main className="py-24 flex-1 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
          {children}
        </div>
      </main>
    </>
  );
}
