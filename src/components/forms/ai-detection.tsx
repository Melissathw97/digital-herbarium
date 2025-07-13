import ImageUploader from "../imageUploader";
import { Button } from "../ui/button";

export default function AiDetectionForm() {
  return (
    <div className="flex flex-col w-full gap-6 items-end justify-center mb-6 max-w-lg mx-auto">
      <div className="flex flex-col gap-2 w-full">
        <label>Upload an image</label>
        <ImageUploader />
      </div>

      <Button>Begin detection</Button>
    </div>
  );
}
