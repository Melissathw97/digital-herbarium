import { HardDriveUpload } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader({
  accept = ".jpg, .jpeg, .png",
  disabled,
  handleFiles,
}: {
  accept?: string;
  disabled?: boolean;
  handleFiles: (files: File[]) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      handleFiles(acceptedFiles);
    },
    [handleFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="w-full text-lime-700/50 font-semibold bg-gray-100 hover:bg-gray-200 cursor-pointer p-4 py-8 rounded-sm flex flex-col gap-3 text-center items-center h-full justify-center border"
    >
      <input
        disabled={disabled}
        {...getInputProps()}
        accept={accept}
        multiple={false}
      />
      <HardDriveUpload />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop an image here, or click to select files</p>
      )}
    </div>
  );
}
