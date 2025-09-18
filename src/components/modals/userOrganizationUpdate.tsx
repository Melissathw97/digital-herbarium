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
import UserCard from "../cards/user";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { updateUserOrganization } from "@/services/userServices";
import { getOrganizations } from "@/services/organizationServices";

export default function UserOrganizationUpdateModal({
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
  const [organization, setOrganization] = useState("");
  const [organizations, setOrganizations] = useState<
    { value: string; label: string }[]
  >([]);

  const onUpdateClick = () => {
    if (user)
      updateUserOrganization({ userId: user.id, organizationId: organization })
        .then(() => {
          toast.success("User organization updated successfully");
          toggle();
          onUpdateSuccess();
        })
        .catch((error) => {
          toast.error(error);
        });
  };

  useEffect(() => {
    getOrganizations().then((data) => {
      setOrganizations(
        data.map(({ id, name }) => ({ value: id, label: name }))
      );
    });
  }, []);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Organization</AlertDialogTitle>
          <div className="flex flex-col gap-4 mt-3">
            {user && <UserCard user={user} fullDetails={false} />}

            <div className="flex flex-col gap-2">
              <label>Current Organization</label>

              <Input value={user?.organization?.name} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <label>New Organization</label>
              <Select
                value={organization}
                onValueChange={(value) => setOrganization(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {organizations.map(({ label, value }) => (
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
          <AlertDialogAction onClick={onUpdateClick} className="w-40">
            Update Organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
