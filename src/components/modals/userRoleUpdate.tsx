import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import { Crown, User as UserIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function UserRoleUpdateModal({
  open,
  toggle,
  user,
}: {
  open: boolean;
  toggle: () => void;
  user?: User;
}) {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit User Role</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-3 mt-2">
            <div className="flex items-center gap-2 mb-4 bg-lime-700/5 p-3 rounded-sm shadow-sm">
              <div className="bg-gray-200 h-10 w-10 rounded-full grid place-items-center font-semibold text-gray-500 uppercase shrink-0">
                {user?.name.substring(0, 1)}
              </div>

              <div className="flex flex-col gap-1 overflow-hidden items-start">
                <p
                  title={user?.name}
                  className="font-medium whitespace-nowrap overflow-hidden w-full text-ellipsis"
                >
                  {user?.name}
                </p>
                {role === "admin" ? (
                  <div className="bg-violet-100 text-violet-800 px-1.5 py-0.5 text-[10px] rounded-sm font-semibold flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Admin
                  </div>
                ) : (
                  <div className="bg-sky-100 text-sky-800 px-1.5 py-0.5 text-[10px] rounded-sm font-semibold flex items-center gap-1">
                    <UserIcon className="h-3 w-3" />
                    Member
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>New Role</label>
              <Select value={role} onValueChange={(value) => setRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[
                      { label: "Admin", value: "super_admin" },
                      { label: "Member", value: "member" },
                    ].map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={toggle}>
            Cancel
          </Button>
          <AlertDialogAction onClick={toggle} className="w-32">
            Update Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
