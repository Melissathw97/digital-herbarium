import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plant } from "@/types/plant";
import { Button } from "../ui/button";
import { deletePlants } from "@/services/plantServices";

export default function PlantBulkDeleteModal({
  open,
  plants,
  toggle,
  onDeleteSuccess,
}: {
  open: boolean;
  plants?: Plant[];
  toggle: () => void;
  onDeleteSuccess: () => void;
}) {
  const onDeleteClick = () => {
    if (plants?.length)
      deletePlants({ ids: plants?.map((plant) => plant.id) })
        .then(() => {
          toast.success("Plants deleted successfully");
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
            Are you sure you wish to delete {plants?.length} plant(s)?
          </AlertDialogTitle>
          <div className="flex flex-col justify-center gap-6">
            <p className="text-gray-600">
              This will permanently delete the plant records from this platform.
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
