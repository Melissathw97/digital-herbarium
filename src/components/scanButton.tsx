import { RefObject, useState } from "react";
import { ScanText } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Spinner from "./spinner";
import Tesseract, { RecognizeResult } from "tesseract.js";

export default function ScanButton({
  previewRef,
  onSubmit,
  isBarcode = false,
}: {
  previewRef: RefObject<HTMLImageElement | null>;
  onSubmit: (text: string) => void;
  isBarcode?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const imgSrctoBlob = async (src: string): Promise<Blob> => {
    const response = await fetch(src);

    if (!response.ok) {
      // This might happen if the original Blob was revoked,
      // or the URL is somehow invalid.
      throw new Error(
        `Failed to fetch blob URL: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    return blob;
  };

  const handleSubmitAppend = async () => {
    setIsLoading(true);

    if (previewRef.current) {
      const blob = await imgSrctoBlob(previewRef.current.src);
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
        .then((result: RecognizeResult | void) => {
          let text = result?.data.text;

          if (isBarcode)
            text = result?.data.text.match(/([0-9]){5}/)?.[0] || "";

          if (!text) toast.error("No text found");
          if (text) onSubmit(text);
          setIsLoading(false);
        });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSubmitAppend}
      disabled={isLoading || !previewRef.current}
    >
      {isLoading ? <Spinner className="text-white" /> : <ScanText />}
    </Button>
  );
}
