import { Calendar, Crown, Mail, User } from "lucide-react";

export default function UserCard({
  name,
  role,
  email,
  dateJoined,
}: {
  name: string;
  role: string;
  email: string;
  dateJoined: string;
}) {
  return (
    <div className="bg-white shadow-sm rounded-sm px-6 py-4 border flex flex-col gap-1 justify-center">
      <div className="flex gap-4">
        <div className="bg-gray-200 h-10 w-10 rounded-full grid place-items-center font-semibold text-gray-500 uppercase">
          {name.substring(0, 1)}
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-medium">{name}</p>
          {role === "admin" ? (
            <div className="bg-violet-100 text-violet-800 px-1.5 py-0.5 text-[10px] rounded-sm font-semibold flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Admin
            </div>
          ) : (
            <div className="bg-sky-100 text-sky-800 px-1.5 py-0.5 text-[10px] rounded-sm font-semibold flex items-center gap-1">
              <User className="h-3 w-3" />
              Member
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4" />

      <div className="flex flex-col gap-2 mt-4 mb-2 text-xs text-gray-600">
        <div className="flex gap-2 items-center">
          <Mail className="h-3.5 w-3.5" />
          <p className="font-medium">{email}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="h-3.5 w-3.5" />
          <p className="font-medium">Joined {dateJoined}</p>
        </div>
      </div>
    </div>
  );
}
