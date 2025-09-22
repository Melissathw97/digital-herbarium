import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Badge from "@/components/badge";
import { MailCheck } from "lucide-react";

export default function SupportSentModal({
  open,
  ticketId,
  onConfirm,
}: {
  open: boolean;
  ticketId: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="gap-8 pt-8">
        <AlertDialogHeader>
          <MailCheck className="text-lime-700 w-8 h-8 mx-auto mb-2" />
          <div className="flex justify-center">
            <Badge size="lg" variant="info">
              Ticket ID: <b>{ticketId}</b>
            </Badge>
          </div>
          <AlertDialogTitle className="text-center">
            Your enquiry has been received.
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Our support team will reach out to you within 1-3 working days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <AlertDialogAction onClick={onConfirm} className="w-32">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
