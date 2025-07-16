const TO_RADIANS = Math.PI / 180;

// interface CanvasPreviewOptions {
//   image: HTMLImageElement;
//   canvas: HTMLCanvasElement;
//   crop: { x: number; y: number; width: number; height: number };
//   scale?: number;
//   rotate?: number;
//   pan?: { x: number; y: number }; // 👈 new
// }

export function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: { x: number; y: number; width: number; height: number },
  scale: number = 1,
  rotate: number = 0,
  pan: { x: number; y: number } = { x: 0, y: 0 }
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 6) Shift based on the crop
  ctx.translate(-cropX, -cropY);

  // 5) Apply pan offset
  ctx.translate(pan.x * scaleX, pan.y * scaleY);

  // 4) Move origin to image center
  ctx.translate(centerX, centerY);

  // 3) Apply rotation
  ctx.rotate(rotateRads);

  // 2) Apply scale
  ctx.scale(scale, scale);

  // 1) Move image to origin
  ctx.translate(-centerX, -centerY);

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}
