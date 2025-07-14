import { HardDriveUpload } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader({ disabled }: { disabled: boolean }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="w-full text-gray-400 bg-gray-100 hover:bg-gray-200 cursor-pointer p-4 py-8 rounded-sm flex flex-col gap-3 text-center items-center h-full justify-center"
    >
      <input disabled={disabled} {...getInputProps()} />
      <HardDriveUpload />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
}
