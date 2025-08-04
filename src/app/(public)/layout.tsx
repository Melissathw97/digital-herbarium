import Navbar from "./navbar";

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
      </main>
    </>
  );
}
