import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock3 } from "lucide-react";

export default function UserResetPasswordModal({ open }: { open: boolean }) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="gap-8 pt-8">
        <AlertDialogHeader>
          <Clock3 className="text-lime-700 w-8 h-8 mx-auto mb-2" />
          <AlertDialogTitle className="text-center">
            Password Pending Update
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Please check your inbox for an email to reset your password.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
