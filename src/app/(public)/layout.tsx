import Navbar from "./navbar";
import Link from "next/link";
import { Pages } from "@/types/pages";
import { MessageCircleQuestionMark } from "lucide-react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Header */}
      <Navbar />

      {/* Content */}
      <main className="py-24 flex-1 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
          {children}
        </div>

        <div className="fixed bottom-8 right-8">
          <Link href={Pages.SUPPORT}>
            <button className="bg-indigo-600 hover:bg-indigo-700 hover:scale-[110%] rounded-full p-3 text-white transition">
              <MessageCircleQuestionMark />
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
