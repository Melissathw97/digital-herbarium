"use client";

import { toast } from "sonner";
import { Pages } from "@/types/pages";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/fileUploader";
import { useAuth } from "@/utils/supabase/tokenStorage";
import ImportFileCard from "@/components/cards/importFile";
import { getTemplate, postImport } from "@/services/plantServices";
import UploadSuccessfulModal from "@/components/modals/uploadSuccessful";

interface Template {
  name: string;
  download_url: string;
  type: string;
  description: string;
}

export default function ImportPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [file, setFile] = useState<File>();
  const [isUploadSuccessfulModalOpen, setIsUploadSuccessfulModalOpen] =
    useState(false);

  useEffect(() => {
    getTemplate()
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        toast.error(`Failed to fetch template and guideline: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onImport = () => {
    if (!file) {
      toast.warning("Please select a file to import.");
      return;
    }

    postImport(file)
      .then((response) => {
        console.log("res", response);
        setIsUploadSuccessfulModalOpen(true);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(`Failed to import data: ${error.errors[0].error}`);
      });
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => router.back()}
          className="hover:bg-gray-200 p-1 rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2>Import Data</h2>
      </div>

      <div className="bg-white shadow-sm rounded-md px-6 py-6 border flex flex-col gap-7">
        {templates.length > 0 && isAdmin === false && (
          <div className="bg-red-100 text-red-700 font-semibold text-center p-2 rounded-sm">
            This feature is reserved for Admins and Super Admins only.
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-lime-700/20 text-lime-900 text-xs flex items-center justify-center font-semibold shrink-0">
              1
            </div>

            <div className="flex-1">
              <p className="text-gray-700 font-semibold leading-6">
                Download the official Excel template and guideline.
              </p>
              <p className="text-xs text-gray-500 text-center text-left">
                Please download both files and follow the instructions before
                uploading your data.
              </p>
              {loading ? (
                <Spinner className="mt-10 mb-8" />
              ) : templates.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  {templates.map((file) => (
                    <div key={file.name}>
                      {isAdmin ? (
                        <a
                          href={file.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block shadow-sm hover:shadow-md transition hover:scale-[1.02] rounded-lg h-full"
                        >
                          <ImportFileCard file={file} />
                        </a>
                      ) : (
                        <ImportFileCard file={file} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="w-full text-center text-sm text-gray-400 pt-8 pb-4">
                  No templates found
                </p>
              )}
            </div>
          </div>
        </div>

        <hr />

        <div className="flex gap-3 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-lime-700/20 text-lime-900 text-xs flex items-center justify-center font-semibold shrink-0">
            2
          </div>

          <div className="overflow-hidden">
            <p className="text-gray-700 font-semibold leading-6">
              Upload the completed Excel file.
            </p>
            <p className="text-xs text-gray-500 text-center text-left">
              All uploaded data will be automatically marked as{" "}
              <span className="font-semibold text-lime-700">Approved</span>.
            </p>

            {templates.length > 0 && (
              <div className="flex items-center mt-4 gap-4 w-full">
                <div className="overflow-hidden">
                  <FileUploader
                    file={file}
                    onFileChange={setFile}
                    disabled={!isAdmin}
                    placeholder="Choose Excel file"
                  />
                </div>

                <Button
                  className="w-32 shrink-0"
                  onClick={onImport}
                  disabled={!isAdmin}
                >
                  Import
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UploadSuccessfulModal
        open={isUploadSuccessfulModalOpen}
        onConfirm={() => {
          setIsUploadSuccessfulModalOpen(!isUploadSuccessfulModalOpen);
          router.push(`${Pages.PLANTS}/?tab=All%20Records`);
        }}
      />
    </>
  );
}
