import React, { useState, useRef, RefObject, useEffect } from "react";
import { Crop, RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import ImageUploader from "./imageUploader";

import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./canvasPreview";
import ReactCrop, { PixelCrop } from "react-image-crop";

export default function CropperOld({
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
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [crop, setCrop] = useState({});
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isCroppingEnabled, setIsCroppingEnabled] = useState(false);

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
        rotate,
        pan
      );
    }
  }, [completedCrop, scale, rotate, previewCanvasRef, pan]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCroppingEnabled) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCroppingEnabled || !dragStart.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    dragStart.current = null;
  };

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
                variant={isCroppingEnabled ? "secondary" : "ghost"}
                onClick={() => setIsCroppingEnabled(!isCroppingEnabled)}
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
        <ImageUploader accept=".jpg, .jpeg" handleFiles={onSelectFile} />
      )}

      {imgSrc && (
        <div
          style={{
            width: "full",
            height: "full",
            overflow: "hidden",
            border: "1px solid #ccc",
            cursor: isCroppingEnabled ? "crosshair" : "grab",
            position: "relative",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <ReactCrop
            crop={crop}
            disabled={!isCroppingEnabled}
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
              width={550}
              height={400}
              style={{
                // transform: `scale(${scale}) rotate(${rotate}deg)`,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale}) rotate(${rotate}deg)`,
                // transformOrigin: "top left",
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
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
