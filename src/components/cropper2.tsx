// ImageCropper.tsx
import React, { RefObject, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from "next/image";
import ImageUploader from "./imageUploader";

export default function ImageCropper({
  imgSrc,
  previewCanvasRef,
  handleSetImgSrc,
  handleSetSelectedFile,
}: {
  imgSrc: string;
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  handleSetImgSrc: (src: string) => void;
  handleSetSelectedFile: (files?: File) => void;
}) {
  const [crop, setCrop] = useState({});
  const cropperRef = useRef<HTMLImageElement>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onSelectFile = (files: File[]) => {
    if (files?.length) {
      handleSetSelectedFile(files[0]);
      setCrop({ width: 0, height: 0 }); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        handleSetImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(files[0]);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      const croppedUrl = canvas.toDataURL("image/png");
      setCroppedImage(croppedUrl);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center h-full">
      {!imgSrc && (
        <ImageUploader accept=".jpg, .jpeg" handleFiles={onSelectFile} />
      )}

      {imgSrc && (
        <div className="w-full max-w-3xl">
          <Cropper
            src={imgSrc}
            style={{ height: 400, width: "100%" }}
            aspectRatio={16 / 9} // or undefined for freeform
            guides={true}
            zoomable={true}
            movable={true}
            dragMode="move"
            cropBoxMovable={true}
            cropBoxResizable={true}
            background={false}
            responsive={true}
            autoCropArea={1}
            ref={cropperRef}
            viewMode={2} // restrict crop box to stay within the canvas
          />
          <div className="flex justify-between mt-2">
            <button
              onClick={handleCrop}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Crop
            </button>
          </div>
        </div>
      )}

      {croppedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Cropped Image:</h3>
          <Image
            width={500}
            height={400}
            src={croppedImage}
            alt="Cropped preview"
            className="rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
