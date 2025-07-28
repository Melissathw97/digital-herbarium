import { Button } from "../ui/button";
import Badge from "@/components/badge";
import formatDate from "@/utils/formatDate";
import { Calendar, Crown, Mail, Pen, Trash, User } from "lucide-react";

export default function UserCard({
  name,
  role,
  email,
  dateJoined,
  currentUser,
  onEdit,
  onDelete,
  fullDetails = true,
}: {
  name: string;
  role: string;
  email?: string;
  dateJoined?: string;
  currentUser?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  fullDetails?: boolean;
}) {
  return (
    <div
      className={`${currentUser && "border border-lime-700/50"} bg-white shadow-sm rounded-sm px-5 py-4 border flex flex-col gap-1 justify-center`}
    >
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
          {role === "super_admin" ? (
            <Badge variant="purple">
              <Crown />
              Admin
            </Badge>
          ) : (
            <Badge>
              <User />
              Member
            </Badge>
          )}
        </div>

        <div className="flex gap-1 ml-auto shrink-0 items-start">
          {currentUser ? (
            <div className="inline-block bg-lime-700/10 text-lime-700 text-[10px] rounded-sm px-1.5 py-0.5 mt-0.5 font-medium">
              You
            </div>
          ) : (
            <>
              {onEdit && (
                <Button variant="outline" size="xs" onClick={onEdit}>
                  <Pen />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="xs"
                  className="text-red-700 hover:text-red-700"
                  onClick={onDelete}
                >
                  <Trash />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {fullDetails && (
        <>
          <hr className="mt-2" />

          <div className="flex flex-col gap-2 mt-2 text-xs text-gray-500">
            <div className="flex gap-2 items-center">
              <Mail className="h-3.5 w-3.5" />
              <p className="font-medium">{email}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Calendar className="h-3.5 w-3.5" />
              <p className="font-medium">
                Joined {dateJoined ? formatDate(dateJoined) : "-"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
