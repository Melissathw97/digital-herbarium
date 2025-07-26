import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import UserCard from "../cards/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateUserRole } from "@/services/userServices";

export default function UserRoleUpdateModal({
  open,
  user,
  toggle,
  onUpdateSuccess,
}: {
  open: boolean;
  user?: User;
  toggle: () => void;
  onUpdateSuccess: () => void;
}) {
  const [role, setRole] = useState("");

  const onUpdateClick = () => {
    if (user)
      updateUserRole({ userId: user.id, role })
        .then(() => {
          toast.success("User role updated successfully");
          toggle();
          onUpdateSuccess();
        })
        .catch((error) => {
          toast.error(error);
        });
  };

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit User Role</AlertDialogTitle>
          <div className="flex flex-col gap-4 mt-2">
            {user && (
              <UserCard
                name={`${user?.firstName} ${user?.lastName}`}
                role={user?.role}
                fullDetails={false}
              />
            )}

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
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={toggle}>
            Cancel
          </Button>
          <AlertDialogAction onClick={onUpdateClick} className="w-32">
            Update Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
