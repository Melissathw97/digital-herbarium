import React, { useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";

export default function ZoomPanCropper() {
  const [imgSrc, setImgSrc] = useState<string | undefined>();
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
  };

  const getCroppedImage = () => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    if (!image || !canvas || !crop?.width || !crop?.height) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64 = canvas.toDataURL("image/png");
    setCroppedImageUrl(base64);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <input type="file" accept="image/*" onChange={onSelectFile} />

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setIsCropping((v) => !v)}
      >
        {isCropping ? "Pan Mode" : "Crop Mode"}
      </button>

      {imgSrc && (
        <div
          style={{
            width: 500,
            height: 400,
            overflow: "hidden",
            border: "1px solid #ccc",
          }}
        >
          <TransformWrapper
            disabled={isCropping}
            wheel={{ step: 0.05 }}
            pinch={{ disabled: false }}
            doubleClick={{ disabled: true }}
            panning={{ disabled: false }}
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                disabled={!isCropping}
              >
                <Image
                  alt="Source"
                  src={imgSrc}
                  width={500}
                  height={400}
                  onLoad={onImageLoad}
                  style={{
                    userSelect: "none",
                    pointerEvents: isCropping ? "auto" : "none",
                  }}
                />
              </ReactCrop>
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}

      {isCropping && completedCrop && (
        <>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={getCroppedImage}
          >
            Crop Image
          </button>
          <canvas ref={previewCanvasRef} style={{ display: "none" }} />
        </>
      )}

      {croppedImageUrl && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Cropped Result:</h3>
          <img src={croppedImageUrl} alt="Cropped" />
        </div>
      )}
    </div>
  );
}
