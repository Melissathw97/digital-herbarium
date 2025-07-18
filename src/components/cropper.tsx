import React, { useState, useRef, RefObject, useEffect } from "react";
import { Crop, RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import ImageUploader from "./imageUploader";

import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import ReactCrop, { PixelCrop } from "react-image-crop";

export default function Cropper({
  imgSrc,
  previewCanvasRef,
  handleSetImgSrc,
  handleSetSelectedFile,
}: {
  imgSrc: string;
  previewCanvasRef: RefObject<HTMLCanvasElement | null>;
  handleSetImgSrc: (src: string) => void;
  handleSetSelectedFile: (files?: File) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [crop, setCrop] = useState({});
  const [isCropEnabled, setIsCropEnabled] = useState(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const resetFile = () => {
    handleSetSelectedFile();
    handleSetImgSrc("");
  };

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

  function onImageLoad() {
    setCrop({ width: 0, height: 0 }); // Makes crop preview update between images.
  }

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

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      // We use canvasPreview as it's much faster than imgPreview.

      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
    }
  }, [completedCrop, scale, rotate, previewCanvasRef]);

  return (
    <div className="h-full sticky top-0">
      {imgSrc ? (
        <div className="mb-4">
          <div className="flex border rounded-sm p-0.5 justify-between">
            <Button variant="ghost" onClick={resetFile}>
              <X />
            </Button>
            <div>
              <Button
                variant={isCropEnabled ? "secondary" : "ghost"}
                onClick={() => setIsCropEnabled(!isCropEnabled)}
              >
                <Crop />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setRotate(rotate - 1)}
                onMouseDown={() =>
                  startHold(() => setRotate((prev) => prev - 1))
                }
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
              >
                <RotateCcw />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setRotate(rotate + 1)}
                onMouseDown={() =>
                  startHold(() => setRotate((prev) => prev + 1))
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
      ) : (
        <ImageUploader accept=".jpg, .jpeg, .png" handleFiles={onSelectFile} />
      )}

      {imgSrc && (
        <ReactCrop
          crop={crop}
          disabled={!isCropEnabled}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          // minWidth={400}
          // minHeight={100}
          // circularCrop
        >
          <Image
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            width={500}
            height={400}
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`,
            }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}

      {!!completedCrop && (
        <div>
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid gray",
              objectFit: "contain",
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        </div>
      )}
    </div>
  );
}
