import Image from "next/image";
import "../globals.css";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
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
      <div className="h-screen flex justify-center items-center">
        <div className="bg-white m-auto p-10 min-w-md max-w-lg text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
