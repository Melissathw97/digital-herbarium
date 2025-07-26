export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen py-20 px-2 sm:px-8 flex justify-center items-center">
      <div className="bg-white m-auto p-4 py-8 sm:p-10 w-full max-w-lg rounded-md z-10">
        {children}
      </div>
    </div>
  );
}
