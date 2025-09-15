import ImageUploader from "./imageUploader";
import ImageCropper from "./imageCropper";
import React, { RefObject } from "react";

export default function Cropper({
  imgSrc,
  handleSetImgSrc,
  handleSetSelectedFile,
  onCroppedImageReady,
}: {
  imgSrc: string;
  previewCanvasRef: RefObject<HTMLCanvasElement | null>;
  handleSetImgSrc: (src: string) => void;
  handleSetSelectedFile: (files?: File) => void;
  onCroppedImageReady: (blob: Blob) => void;
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
        />
      )}
    </div>
  );
}
