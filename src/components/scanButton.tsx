import { useState } from "react";
import { ScanText } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Spinner from "./spinner";
import { createWorker } from "tesseract.js";

export default function ScanButton({
  croppedImage,
  onSubmit,
  isBarcode = false,
}: {
  croppedImage: Blob | null;
  onSubmit: (text: string) => void;
  isBarcode?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!croppedImage) {
      alert("Please crop an area first before scanning");
      return;
    }

    setIsLoading(true);

    try {
      const worker = await createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(croppedImage);
      await worker.terminate();

      // Clean up the text (remove extra whitespace and newlines)
      const cleanedText = text.trim().replace(/\s+/g, " ");

      if (!text) {
        toast.error("No text found");
      } else {
        if (isBarcode) onSubmit(cleanedText.match(/([0-9])+/)?.[0] || "");
        else onSubmit(cleanedText);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("OCR Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button type="button" onClick={handleClick} disabled={isLoading}>
      {isLoading ? <Spinner className="text-white" /> : <ScanText />}
    </Button>
  );
}
