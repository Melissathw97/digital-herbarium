import React, { useState, RefObject, useEffect } from "react";
import Image from "next/image";
import ImageCropper from "./imageCropper";
import ImageUploader from "./imageUploader";

export default function Cropper({
  imgSrc,
  previewRef,
  showScanButton,
  handleSetImgSrc,
  handleSetSelectedFile,
}: {
  imgSrc: string;
  previewRef: RefObject<HTMLImageElement | null>;
  showScanButton: () => void;
  handleSetImgSrc: (src: string) => void;
  handleSetSelectedFile: (files?: File) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  const resetFile = () => {
    handleSetSelectedFile();
    handleSetImgSrc("");
    setPreviewUrl("");
  };

  const onSelectFile = (files: File[]) => {
    if (files?.length) {
      handleSetSelectedFile(files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        handleSetImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(files[0]);
    }
  };

  useEffect(() => {
    if (previewUrl) {
      showScanButton();
    }
  }, [previewUrl, showScanButton]);

  return (
    <div className="h-full">
      {imgSrc ? (
        <ImageCropper
          imageSrc={imgSrc}
          resetFile={resetFile}
          onCropCompleteImage={(blob) => {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          }}
        />
      ) : (
        <ImageUploader handleFiles={onSelectFile} />
      )}

      {previewUrl && (
        <div className="inline-block bg-gray-100 mt-4 rounded-md text-center text-gray-600 px-4 pt-4 pb-5 font-semibold text-xs border shadow-xl">
          PREVIEW
          <Image
            ref={previewRef}
            alt="Crop Preview"
            width={300}
            height={100}
            src={previewUrl}
            className="mt-4 shadow-xl rounded-md mx-auto border"
          />
        </div>
      )}
    </div>
  );
}
