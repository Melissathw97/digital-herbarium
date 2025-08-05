import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClockAlert } from "lucide-react";

export default function UserResendEmailModal({
  open,
  isLoading,
  onConfirm,
}: {
  open: boolean;
  isLoading: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="gap-8 pt-8">
        <AlertDialogHeader>
          <ClockAlert className="text-red-700 w-8 h-8 mx-auto mb-2" />
          <AlertDialogTitle className="text-center">
            Confirmation Link Expired
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Please click the button below to send a new confirmation link to
            your inbox to verify your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading
              ? "Re-sending Confirmation Link"
              : "Re-send Confirmation Link"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
