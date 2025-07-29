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
import { deleteUsers } from "@/services/userServices";

export default function UserBulkDeleteModal({
  open,
  users,
  toggle,
  onDeleteSuccess,
}: {
  open: boolean;
  users?: User[];
  toggle: () => void;
  onDeleteSuccess: () => void;
}) {
  const onDeleteClick = () => {
    if (users?.length)
      deleteUsers({ ids: users?.map((user) => user.id) })
        .then(() => {
          toast.success("Users deleted successfully");
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
            Are you sure you wish to delete {users?.length} user(s)?
          </AlertDialogTitle>
          <div className="flex flex-col justify-center gap-6">
            <p className="text-gray-600">
              This will permanently delete the user records from this platform.
            </p>
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
