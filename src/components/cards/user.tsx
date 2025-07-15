import { Calendar, Crown, Mail, PenBox, Trash, User } from "lucide-react";
import { Button } from "../ui/button";

export default function UserCard({
  name,
  role,
  email,
  dateJoined,
  currentUser,
  onEdit,
  onDelete,
}: {
  name: string;
  role: string;
  email: string;
  dateJoined: string;
  currentUser: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white shadow-sm rounded-sm px-5 py-4 border flex flex-col gap-1 justify-center">
      <div className="flex gap-2">
        <div className="bg-gray-200 h-10 w-10 rounded-full grid place-items-center font-semibold text-gray-500 uppercase shrink-0">
          {name.substring(0, 1)}
        </div>

        <div className="flex flex-col gap-1 overflow-hidden items-start">
          <p
            title={name}
            className="font-medium whitespace-nowrap overflow-hidden w-full text-ellipsis"
          >
            {name}
          </p>
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

        <div className="flex gap-1 ml-auto shrink-0 items-start">
          {currentUser ? (
            <div className="inline-block bg-lime-700/10 text-lime-700 text-[10px] rounded-sm px-1.5 py-0.5 mt-0.5 font-medium">
              You
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="!h-7 w-7 hover:text-lime-700"
                onClick={onEdit}
              >
                <PenBox className="!h-3 !w-3" />
              </Button>
              <Button
                variant="outline"
                className="!h-7 w-7 text-red-700 hover:text-lime-700"
                onClick={onDelete}
              >
                <Trash className="!h-3 !w-3" />
              </Button>
            </>
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
