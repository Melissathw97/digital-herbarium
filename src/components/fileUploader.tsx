// components/ui/FileUpload.tsx
"use client";

import React, { useRef } from "react";
import { Button } from "./ui/button";
import { X, Upload, FileSpreadsheet } from "lucide-react";

interface FileUploaderProps {
  file: File | undefined;
  onFileChange: (file: File | undefined) => void;
  accept?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function FileUploader({
  file,
  onFileChange,
  accept = ".xlsx,.xls",
  disabled = false,
  placeholder = "Choose Excel file",
  className = "",
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type if accept is provided
      if (accept) {
        const validTypes = accept.split(",").map((type) => type.trim());
        const isValidType = validTypes.some((type) => {
          if (type.startsWith(".")) {
            return selectedFile.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return selectedFile.type === type;
        });

        if (!isValidType) {
          alert(`Please select a valid file type: ${accept}`);
          return;
        }
      }

      onFileChange(selectedFile);
    }
  };

  const clearFile = () => {
    onFileChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
      />

      {!file ? (
        <>
          <Button
            variant="outline"
            disabled={disabled}
            onClick={triggerFileSelect}
          >
            <Upload />
            {placeholder}
          </Button>
        </>
      ) : (
        <div className="w-full flex items-center gap-4 px-4 py-2 bg-lime-700/5 border border-lime-700 rounded-md">
          <FileSpreadsheet className="w-4 h-4 text-lime-700 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <span
              className="text-sm text-lime-800 truncate block font-medium"
              title={file.name}
            >
              {file.name}
            </span>
            <span className="text-xs text-lime-700/60 leading-tight">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button
            onClick={clearFile}
            className="p-1 rounded-full hover:bg-gray-700/10 transition-colors duration-200 flex-shrink-0"
            title="Remove file"
          >
            <X className="size-4 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}
