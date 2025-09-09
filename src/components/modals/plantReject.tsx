import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChangeEvent, useState } from "react";

export default function PlantRejectModal({
  open,
  toggle,
  onReject,
}: {
  open: boolean;
  toggle: () => void;
  onReject: (remarks: string) => void;
}) {
  const [form, setForm] = useState({ remarks: "" });

  const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setForm({ remarks: value });
  };

  const onRejectClick = () => {
    toggle();
    onReject(form.remarks);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Plant Record</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason why this record is rejected.
          </AlertDialogDescription>
          <div className="flex flex-col gap-2 w-full mt-4">
            <label>
              Reason
              <span className="text-red-600 ml-0.5">*</span>
            </label>
            <Textarea
              name="remarks"
              value={form.remarks}
              onChange={onInputChange}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={toggle}>
            Cancel
          </Button>
          <Button
            className="w-32"
            onClick={onRejectClick}
            disabled={!form.remarks}
          >
            Reject
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
