import React, { ReactElement, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import "react-mobile-cropper/dist/style.css";
import { Crop, Home, Trash2 } from "lucide-react";
import { Cropper, CropperRef } from "react-mobile-cropper";

interface Props {
  imageSrc: string;
  onCropCompleteImage: (croppedImage: Blob | null) => void;
  onResetImage: () => void;
  children?: ReactElement;
}

const ImageCropper = ({
  imageSrc,
  onCropCompleteImage,
  onResetImage,
  children,
}: Props) => {
  const cropperRef = useRef<CropperRef>(null);
  const [isCropped, setIsCropped] = useState(false);

  const getCroppedCanvas = (): HTMLCanvasElement | null => {
    if (!cropperRef.current) return null;

    try {
      // Get the cropped canvas from react-mobile-cropper
      return cropperRef.current.getCanvas({
        width: 800,
        height: 600,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });
    } catch (error) {
      console.error("Error getting cropped canvas:", error);
      return null;
    }
  };

  const getCroppedBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = getCroppedCanvas();
      if (!canvas) {
        resolve(null);
        return;
      }

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropAndExtract = async () => {
    try {
      const croppedBlob = await getCroppedBlob();
      if (!croppedBlob) {
        throw new Error("Failed to get cropped image");
      }
      onCropCompleteImage(croppedBlob);
      setIsCropped(true);
      toast.success("Image cropped");
    } catch (error) {
      toast.error(error instanceof Error ? error?.message : "");
      console.error("Crop Error:", error);
    }
  };

  const resetCropPosition = () => {
    if (cropperRef.current) {
      // Reset the cropper to its initial state
      cropperRef.current.reset();
      onCropCompleteImage(null);
      setIsCropped(false);
    }
  };

  // New handler to detect any changes in the cropper's position or zoom
  const handleCropperChange = () => {
    if (isCropped) {
      setIsCropped(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-1">
        {children}
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetImage}
          className="flex items-center gap-2 whitespace-nowrap"
          title="Remove current image"
        >
          <Trash2 /> Remove Image
        </Button>

        {isCropped && (
          <p className="text-green-600 text-xs font-medium ml-auto">
            ✓ Will use cropped area
          </p>
        )}
      </div>

      <div className="relative w-full h-[505px] bg-gray-200 rounded-md overflow-hidden">
        <Cropper
          ref={cropperRef}
          src={imageSrc}
          className="w-full h-full"
          stencilProps={{
            grid: true,
            aspectRatio: undefined,
          }}
          onChange={handleCropperChange}
        />
      </div>

      <div className="flex justify-center gap-4 w-full">
        <Button
          variant="secondary"
          size="sm"
          onClick={resetCropPosition}
          className="flex items-center gap-2 whitespace-nowrap"
          title="Reset to original position and zoom"
        >
          <Home className="h-4 w-4" />
          Reset View
        </Button>
        <Button
          size="sm"
          onClick={handleCropAndExtract}
          className="flex items-center gap-2 whitespace-nowrap"
          title="Extract cropped area"
        >
          <Crop />
          Extract Crop
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
