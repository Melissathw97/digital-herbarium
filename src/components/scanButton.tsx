import { useState } from "react";
import { ScanText } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Spinner from "./spinner";
import { postOCR } from "@/services/plantServices";

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
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;

        postOCR({
          image: base64.replace(/^data:image\/[a-z]+;base64,/, ""),
        })
          .then(({ text }) => {
            // Clean up the text (remove extra whitespace and newlines)
            const cleanedText = text.trim().replace(/\s+/g, " ");

            if (!text) {
              toast.error("No text found");
            } else {
              if (isBarcode) onSubmit(cleanedText.match(/([0-9])+/)?.[0] || "");
              else onSubmit(cleanedText);
            }

            setIsLoading(false);
          })
          .catch(() => {
            toast.error("OCR scan failed. Please ensure the image is correct.");
            setIsLoading(false);
          });
      };
      reader.onerror = (error) => {
        toast.error(`Error processing cropped image: ${error}`);
        setIsLoading(false);
      };
      reader.readAsDataURL(croppedImage);
    } catch (error) {
      toast.error(error instanceof Error ? error?.message : "");
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
