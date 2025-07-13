"use client";

import { Button } from "@/components/ui/button";
import { Home, LogOut, Sprout, User, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <>
      {/* Header */}
      <nav className="fixed bg-white p-5 py-4 border-b w-screen">
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
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User />
                Profile
              </Button>
            </Link>
            <Link href="/plants">
              <Button variant="ghost" size="sm">
                <LogOut />
                Log Out
              </Button>
            </Link>
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
