import { LoaderCircle } from "lucide-react";

export default function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircle
      className={`animate-spin mx-auto text-lime-700 ${className || ""}`}
    />
  );
}
