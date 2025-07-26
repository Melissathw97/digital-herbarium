import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import UserCard from "../cards/user";
import { deleteUser } from "@/services/userServices";

export default function UserDeleteModal({
  open,
  user,
  toggle,
  onDeleteSuccess,
}: {
  open: boolean;
  user?: User;
  toggle: () => void;
  onDeleteSuccess: () => void;
}) {
  const onDeleteClick = () => {
    if (user)
      deleteUser({ userId: user.id })
        .then(() => {
          toast.success("User deleted successfully");
          toggle();
          onDeleteSuccess();
        })
        .catch((error) => {
          toast.error(error);
        });
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you wish to delete this user?
          </AlertDialogTitle>
          <div className="flex flex-col justify-center gap-6">
            <p className="text-gray-600">
              This will permanently delete the user&apos;s record from this
              platform.
            </p>
            {user && (
              <UserCard
                name={`${user?.firstName} ${user?.lastName}`}
                role={user?.role}
                fullDetails={false}
              />
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={toggle}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-32"
            onClick={onDeleteClick}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
