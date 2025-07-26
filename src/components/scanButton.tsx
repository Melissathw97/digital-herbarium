import { RefObject, useState } from "react";
import { ScanText } from "lucide-react";
import { Button } from "./ui/button";
import Tesseract from "tesseract.js";
import { toast } from "sonner";

export default function ScanButton({
  previewCanvasRef,
  onSubmit,
  isBarcode = false,
}: {
  previewCanvasRef: RefObject<HTMLCanvasElement | null>;
  onSubmit: (text: string) => void;
  isBarcode?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const base64toBlob = (base64Data: string) => {
    const byteString = atob(base64Data.split(",")[1]);
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const handleSubmitAppend = () => {
    setIsLoading(true);

    if (previewCanvasRef.current) {
      const canvasRef = previewCanvasRef.current;
      const imageData64 = canvasRef.toDataURL("image/jpg");
      const blob = base64toBlob(imageData64);
      const croppedImage = window.URL.createObjectURL(blob);

      Tesseract.recognize(croppedImage, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            //   setProgress(parseInt(m.progress * 100));
          }
        },
      })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        })
        .then(({ data }) => {
          let text = data.text;

          if (isBarcode) text = data.text.match(/([0-9]){5}/)?.[0] || "";

          if (!text) toast.error("No text found");
          onSubmit(text);
          setIsLoading(false);
        });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSubmitAppend}
      disabled={isLoading || !previewCanvasRef.current}
    >
      <ScanText />
    </Button>
  );
}
