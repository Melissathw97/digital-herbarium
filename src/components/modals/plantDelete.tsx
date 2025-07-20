import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Plant } from "@/types/plant";
import { deletePlant } from "@/services/plantServices";

export default function PlantDeleteModal({
  open,
  plant,
  toggle,
  onDeleteSuccess,
}: {
  open: boolean;
  plant?: Plant;
  toggle: () => void;
  onDeleteSuccess: () => void;
}) {
  const onConfirm = () => {
    if (plant) {
      deletePlant({ id: plant.id })
        .then(() => {
          toggle();
          onDeleteSuccess();
          alert("Plant deleted successfully!");
        })
        .catch((error) => {
          toggle();
          alert(error);
        });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you wish to delete this plant?
          </AlertDialogTitle>
          <div className="flex flex-col justify-center gap-6">
            <p className="text-gray-600">
              This will permanently delete the plant&apos;s record from this
              platform.
            </p>
            {plant && (
              <div className="bg-white shadow-sm rounded-sm px-5 py-4 border flex flex-col gap-1 justify-center">
                <div className="grid grid-cols-[100px_auto] gap-y-1 font-semibold">
                  <p className="text-lime-700">Family:</p>
                  <span>{plant.family}</span>
                  <p className="text-lime-700">Species:</p>
                  <em>{plant.species}</em>
                </div>
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={toggle}>
            Cancel
          </Button>
          <Button variant="destructive" className="w-32" onClick={onConfirm}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
