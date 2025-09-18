import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CircleCheckBig } from "lucide-react";

export default function UploadSuccessfulModal({
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
          <CircleCheckBig className="text-lime-700 w-8 h-8 mx-auto mb-2" />
          <AlertDialogTitle className="text-center">
            Data Import Successful
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            The data has been imported and can be published at any time.
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
