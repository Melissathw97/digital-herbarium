import { ChangeEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pages } from "@/types/pages";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUploader from "../imageUploader";
import { OrganizationPayload } from "@/types/organization";
import { postOrganization } from "@/services/organizationServices";

export default function OrganizationCreateModal({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) {
  const router = useRouter();

  const [image, setImage] = useState("");
  const [formValues, setFormValues] = useState<OrganizationPayload>({
    nid: "",
    name: "",
    image: undefined,
  });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectFile = (files: File[]) => {
    if (files?.length) {
      const file = files[0];
      setFormValues((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImage(reader.result?.toString() || "")
      );
      reader.readAsDataURL(file);
    }
  };

  const onCreateClick = () => {
    postOrganization(formValues)
      .then((data) => {
        toast.success("Organization created successfully");
        toggle();
        router.push(`${Pages.ORGANIZATIONS}/${data.id}`);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="!max-w-md gap-8 pt-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Organization</AlertDialogTitle>

          <div className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col gap-1 w-full">
              <label>
                Logo<span className="text-red-600 ml-1">*</span>
              </label>

              {image ? (
                <>
                  <Image
                    alt="Uploaded logo"
                    src={image}
                    width={60}
                    height={60}
                    className="rounded-full object-contain w-[60px] h-[60px] mx-auto shadow-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setImage("");
                      setFormValues((prev) => ({ ...prev, image: undefined }));
                    }}
                    className="mt-2"
                  >
                    <Trash2 />
                    Remove Image
                  </Button>
                </>
              ) : (
                <ImageUploader handleFiles={onSelectFile} />
              )}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label>
                ID<span className="text-red-600 ml-0.5">*</span>
              </label>
              <Input
                name="nid"
                value={formValues.nid}
                onChange={onInputChange}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label>
                Name<span className="text-red-600 ml-0.5">*</span>
              </label>
              <Input
                name="name"
                value={formValues.name}
                onChange={onInputChange}
              />
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button variant="outline" className="w-32" onClick={toggle}>
            Cancel
          </Button>
          <AlertDialogAction onClick={onCreateClick} className="w-40">
            Add Organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
