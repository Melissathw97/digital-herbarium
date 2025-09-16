import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Plant } from "@/types/plant";
import { publishPlant } from "@/services/plantServices";

export default function PlantPublishModal({
  open,
  plant,
  toggle,
  onPublishSuccess,
}: {
  open: boolean;
  plant?: Plant;
  toggle: () => void;
  onPublishSuccess: () => void;
}) {
  const onConfirm = () => {
    if (plant) {
      publishPlant({ id: plant.id, isPublished: !plant.isPublished })
        .then(() => {
          toggle();
          onPublishSuccess();

          if (plant?.isPublished) {
            toast.success("Plant unpublished successfully");
          } else {
            toast.success("Plant published successfully");
          }
        })
        .catch((error) => {
          toggle();
          toast.error(error.message);
        });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {plant?.isPublished ? "Unpublish" : "Publish"} this plant record?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {plant?.isPublished
              ? "This plant record will become visible only to members of your organization."
              : "Once published, this plant record will become visible to members of all organizations. Don't worry—you can unpublish it whenever you like."}
          </AlertDialogDescription>
          <div className="mt-4">
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
          <Button className="w-32" onClick={onConfirm}>
            {plant?.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
