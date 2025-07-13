import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BadgeCheck } from "lucide-react";

export default function UserVerifiedModal({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="gap-6">
        <AlertDialogHeader>
          <BadgeCheck className="text-lime-700 w-10 h-10 mx-auto" />
          <AlertDialogTitle className="text-center">
            Account Verified
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your account now has access to the digital herbarium. Enjoy!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <AlertDialogAction onClick={toggle} className="w-32">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
