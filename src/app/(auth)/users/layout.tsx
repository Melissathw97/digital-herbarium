import Image from "next/image";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative py-20 px-8 flex justify-center items-center">
      <Image
        alt="herbarium"
        src="/herbarium-background.png"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: "-10",
        }}
      />
      <div className="bg-white m-auto p-10 w-full min-w-md max-w-lg rounded-md">
        {children}
      </div>
    </div>
  );
}
