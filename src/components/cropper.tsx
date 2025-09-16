import React, { ReactElement } from "react";
import ImageCropper from "./imageCropper";
import ImageUploader from "./imageUploader";

export default function Cropper({
  imgSrc,
  handleSetImgSrc,
  handleSetSelectedFile,
  onCroppedImageReady,
  children,
}: {
  imgSrc: string;
  handleSetImgSrc: (src: string) => void;
  handleSetSelectedFile: (files?: File) => void;
  onCroppedImageReady: (blob: Blob | null) => void;
  children?: ReactElement;
}) {
  const resetFile = () => {
    handleSetSelectedFile();
    handleSetImgSrc("");
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

  return (
    <div className="h-full">
      {!imgSrc && <ImageUploader handleFiles={onSelectFile} />}

      {imgSrc && (
        <ImageCropper
          imageSrc={imgSrc}
          onCropCompleteImage={onCroppedImageReady}
          onResetImage={resetFile}
        >
          {children}
        </ImageCropper>
      )}
    </div>
  );
}
