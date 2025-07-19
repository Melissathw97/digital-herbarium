import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock3 } from "lucide-react";

export default function UserPendingVerificationModal({
  open,
  onConfirm,
}: {
  open: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="gap-8 pt-8">
        <AlertDialogHeader>
          <Clock3 className="text-lime-700 w-8 h-8 mx-auto mb-2" />
          <AlertDialogTitle className="text-center">
            Account Pending Verification
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Please check your inbox for a verification email to access the
            digital herbarium.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <AlertDialogAction onClick={onConfirm} className="w-32">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
