import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import UserCard from "../cards/user";

export default function UserDeleteModal({
  open,
  toggle,
  user,
}: {
  open: boolean;
  toggle: () => void;
  user?: User;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you wish to delete this user?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col justify-center gap-6">
            <p>
              This will permanently delete the user&apos;s record from this
              platform.
            </p>
            {user && (
              <UserCard
                name={user?.name}
                role={user?.role}
                fullDetails={false}
              />
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={toggle}>
            Cancel
          </Button>
          <Button variant="destructive" className="w-32" onClick={toggle}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
