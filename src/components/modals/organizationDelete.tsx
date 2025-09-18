import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Organization } from "@/types/organization";
import { deleteOrganization } from "@/services/organizationServices";

export default function OrganizationDeleteModal({
  open,
  organization,
  onClose,
  onDeleteSuccess,
}: {
  open: boolean;
  organization?: Organization;
  onClose: () => void;
  onDeleteSuccess: () => void;
}) {
  const onConfirm = () => {
    if (organization) {
      deleteOrganization(organization.id)
        .then(() => {
          onDeleteSuccess();
          toast.success("Organization deleted successfully.");
        })
        .catch((error) => {
          onClose();
          toast.error(`Failed to delete organization: ${error}`);
        });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-lg gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you wish to delete this organization?
          </AlertDialogTitle>
          <div className="flex flex-col justify-center gap-6">
            <p className="text-gray-600 text-sm">
              This will permanently delete the organization&apos;s record from
              this platform. Please make sure there is no user assigned to this
              organization.
            </p>
            {organization && (
              <div className="bg-white shadow-sm rounded-sm px-5 py-4 border flex gap-3 items-center">
                {organization.imageUrl ? (
                  <Image
                    alt="Logo"
                    src={organization.imageUrl}
                    width={35}
                    height={35}
                    className="rounded-full border size-[40px]"
                  />
                ) : (
                  <div className="rounded-full border size-[35px]">
                    <ImageIcon />
                  </div>
                )}

                <div>
                  <p className="font-semibold">{organization.name}</p>
                  <p className="text-gray-500">ID: {organization.nid}</p>
                </div>
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={onClose}>
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
