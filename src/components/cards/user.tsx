import { Button } from "../ui/button";
import Badge from "@/components/badge";
import formatDate from "@/utils/formatDate";
import { User, UserRole } from "@/types/user";
import {
  Calendar,
  CircleCheck,
  Crown,
  Mail,
  Pen,
  Trash,
  User as UserIcon,
} from "lucide-react";

export default function UserCard({
  user,
  currentUser,
  isSelected,
  onEdit,
  onDelete,
  onSelect,
  fullDetails = true,
}: {
  user: User;
  currentUser?: boolean;
  isSelected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  fullDetails?: boolean;
}) {
  const fullName = user.firstName + " " + user.lastName;
  const allowSelect = onSelect && !currentUser;

  return (
    <div
      className={`bg-white shadow-sm rounded-sm px-5 py-4 border flex flex-col gap-1 justify-center ${allowSelect && "cursor-pointer"}`}
      onClick={allowSelect ? () => onSelect() : undefined}
    >
      <div className="flex gap-2">
        <div className="bg-gray-200 h-10 w-10 rounded-full grid place-items-center font-semibold text-gray-500 uppercase shrink-0">
          {user.firstName.substring(0, 1)}
        </div>

        <div className="flex flex-col gap-1 overflow-hidden items-start">
          <p
            title={fullName}
            className="font-medium whitespace-nowrap overflow-hidden w-full text-ellipsis"
          >
            {fullName}
          </p>
          {user.role === UserRole.ADMIN ? (
            <Badge variant="purple">
              <Crown />
              Admin
            </Badge>
          ) : (
            <Badge>
              <UserIcon />
              Member
            </Badge>
          )}
        </div>

        <div className="flex gap-1 ml-auto shrink-0 items-start">
          {currentUser ? (
            <div className="inline-block bg-gray-600 text-white text-[10px] rounded-sm px-1.5 py-0.5 mt-0.5 font-medium">
              You
            </div>
          ) : isSelected ? (
            <CircleCheck className="size-5 text-white bg-lime-700 rounded-full" />
          ) : (
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pen />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="xs"
                  className="text-red-700 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
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
              <Mail className="size-3.5 shrink-0" />
              <p className="font-medium overflow-hidden overflow-ellipsis">
                {user.email}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Calendar className="size-3.5 shrink-0" />
              <p className="font-medium overflow-hidden overflow-ellipsis">
                Joined {user.joinedAt ? formatDate(user.joinedAt) : "-"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
