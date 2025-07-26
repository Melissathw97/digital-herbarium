import Image from "next/image";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="fixed w-screen h-screen">
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
      </div>
      <div className="min-h-screen relative py-20 px-8 flex justify-center items-center">
        <div className="bg-white m-auto p-10 w-full min-w-md max-w-lg rounded-md z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
