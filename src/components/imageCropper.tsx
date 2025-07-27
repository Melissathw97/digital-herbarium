import React, { useState, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/croppedImage";
import { Crop, RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  imageSrc: string;
  resetFile: () => void;
  onCropCompleteImage: (croppedImage: Blob) => void;
}

const ImageCropper = ({ imageSrc, resetFile, onCropCompleteImage }: Props) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = async () => {
    if (croppedAreaPixels)
      try {
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation
        );
        onCropCompleteImage(croppedImage);
      } catch (e) {
        console.error("Crop failed", e);
      }
  };

  const startHold = (callback: () => void) => {
    // Prevent multiple intervals if already holding
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      callback();
    }, 100); // Execute every 100ms
  };

  const stopHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex border rounded-sm p-0.5 justify-between">
          <Button variant="ghost" onClick={resetFile}>
            <X />
          </Button>
          <div>
            <Button variant="ghost" onClick={showCroppedImage}>
              <Crop />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setRotation(rotation - 1)}
              onMouseDown={() =>
                startHold(() => setRotation((prev) => prev - 1))
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <RotateCcw />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setRotation(rotation + 1)}
              onMouseDown={() =>
                startHold(() => setRotation((prev) => prev + 1))
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <RotateCw />
            </Button>
            <Button
              variant="ghost"
              disabled={scale <= 1}
              onClick={() => setScale(scale - 0.1)}
              onMouseDown={() =>
                startHold(() => setScale((prev) => prev - 0.1))
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <ZoomOut />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setScale(scale + 0.1)}
              onMouseDown={() =>
                startHold(() => setScale((prev) => prev + 0.1))
              }
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <ZoomIn />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[450px] bg-gray-200 rounded-md overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={scale}
          rotation={rotation}
          aspect={undefined}
          onCropChange={setCrop}
          onZoomChange={setScale}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
        />
      </div>
    </div>
  );
};

export default ImageCropper;
