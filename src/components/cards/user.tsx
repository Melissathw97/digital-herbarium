import { Button } from "../ui/button";
import formatDate from "@/utils/formatDate";
import { User } from "@/types/user";
import UserRoleBadge from "../userRoleBadge";
import {
  Building2,
  Calendar,
  CircleCheck,
  EllipsisVertical,
  Eye,
  Mail,
  Pen,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserCard({
  user,
  currentUser,
  isSelected,
  onEdit,
  onDelete,
  onSelect,
  onViewDetails,
  fullDetails = true,
}: {
  user: User;
  currentUser?: boolean;
  isSelected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  onViewDetails?: () => void;
  fullDetails?: boolean;
}) {
  const fullName = user.firstName + " " + user.lastName;
  const allowSelect = onSelect && !currentUser;
  const showActionDropdown = onViewDetails || onEdit || onDelete;

  return (
    <div
      className={`bg-white shadow-sm rounded-sm px-5 py-4 border flex flex-col gap-1 justify-center ${allowSelect && "cursor-pointer"}`}
      onClick={allowSelect ? () => onSelect() : undefined}
    >
      <div className="flex gap-2">
        <div
          className="h-10 w-10 rounded-full grid place-items-center font-semibold text-gray-600 uppercase shrink-0"
          style={{
            backgroundColor: user?.organization?.colourCode || "lightgrey",
          }}
        >
          {user.firstName.substring(0, 1)}
        </div>

        <div className="flex flex-col gap-1 overflow-hidden items-start">
          <p
            title={fullName}
            className="font-medium whitespace-nowrap overflow-hidden w-full text-ellipsis"
          >
            {fullName}
          </p>
          <UserRoleBadge user={user} />
        </div>

        <div className="flex gap-1 ml-auto shrink-0 items-start">
          {currentUser ? (
            <div className="inline-block bg-gray-600 text-white text-[10px] rounded-sm px-1.5 py-0.5 mt-0.5 font-medium">
              You
            </div>
          ) : isSelected ? (
            <CircleCheck className="size-5 text-white bg-lime-700 rounded-full" />
          ) : (
            showActionDropdown && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="!px-2">
                      <EllipsisVertical className="text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {onViewDetails && (
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails();
                        }}
                      >
                        <Eye className="!w-3.5 !h-3.5" /> View Details
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit();
                        }}
                      >
                        <Pen className="!w-3.5 !h-3.5" /> Edit Role
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                      >
                        <Trash2 className="!w-3.5 !h-3.5" /> Delete User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )
          )}
        </div>
      </div>

      {fullDetails && (
        <>
          <hr className="mt-2" />

          <div className="flex flex-col gap-2 mt-2 text-xs text-gray-500">
            <div className="flex gap-2 items-center">
              <Mail className="size-3.5 shrink-0" />
              <p className="font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
                {user.email}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Building2 className="size-3.5 shrink-0" />
              <p className="font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
                {user.organization?.nid}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Calendar className="size-3.5 shrink-0" />
              <p className="font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
                Joined {user.joinedAt ? formatDate(user.joinedAt) : "-"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
