import type { Area } from "react-easy-crop";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous"); // to avoid CORS issues
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });

const getRadianAngle = (degreeValue: number) => (degreeValue * Math.PI) / 180;

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  const rotRad = getRadianAngle(rotation);

  // set canvas dimensions
  // We create an offscreen canvas that's large enough to hold the entire rotated image
  // This intermediate canvas is crucial for correct rotation before cropping
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) throw new Error("Could not get temp canvas context");

  // calculate the size of the bounding box after rotation
  const sWidth = image.width;
  const sHeight = image.height;
  const absRotRad = Math.abs(rotRad);

  const cos = Math.cos(absRotRad);
  const sin = Math.sin(absRotRad);

  const rotatedWidth = sHeight * sin + sWidth * cos;
  const rotatedHeight = sHeight * cos + sWidth * sin;

  // Set temporary canvas to be large enough to contain the rotated image
  tempCanvas.width = rotatedWidth;
  tempCanvas.height = rotatedHeight;

  // Move the temp canvas origin to its center
  tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
  // Rotate the temp canvas
  tempCtx.rotate(rotRad);
  // Draw the image onto the temp canvas centered
  tempCtx.drawImage(image, -sWidth / 2, -sHeight / 2);

  // Now, set the final canvas to the size of the pixelCrop
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Set the fill color to white
  ctx.fillStyle = "white";
  // Fill the canvas with white
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the specific cropped area from the temporary (rotated) canvas
  // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  // sx, sy, sWidth, sHeight: source rectangle from the image
  // dx, dy, dWidth, dHeight: destination rectangle on the canvas
  ctx.drawImage(
    tempCanvas, // Use the temporary canvas as the source
    pixelCrop.x, // sx: x-coordinate of the top-left corner of the source rectangle
    pixelCrop.y, // sy: y-coordinate of the top-left corner of the source rectangle
    pixelCrop.width, // sWidth: width of the source rectangle
    pixelCrop.height, // sHeight: height of the source rectangle
    0, // dx: x-coordinate of the top-left corner of the destination rectangle
    0, // dy: y-coordinate of the top-left corner of the destination rectangle
    pixelCrop.width, // dWidth: width of the destination rectangle
    pixelCrop.height // dHeight: height of the destination rectangle
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas is empty"));
      resolve(blob);
    }, "image/jpeg");
  });
};
