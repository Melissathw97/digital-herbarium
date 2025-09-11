import { ChevronDown, Info, TriangleAlert } from "lucide-react";

type AlertVariant = "warning" | "info";

export default function Alert({
  children,
  variant = "info",
  title,
  expand = false,
  isExpanded = true,
  toggleExpand,
}: {
  children?: React.ReactNode;
  variant?: AlertVariant;
  title: string;
  expand?: boolean;
  isExpanded?: boolean;
  toggleExpand?: () => void;
}) {
  return (
    <div
      className={`flex gap-2 items-start border p-2 px-4 rounded-sm mb-5 w-full ${variant === "info" ? "bg-blue-50 border-blue-100 text-blue-600" : ""} ${variant === "warning" ? "bg-orange-50 border-orange-200 text-orange-700" : ""}`}
    >
      {variant === "warning" ? (
        <TriangleAlert className="w-4" />
      ) : (
        <Info className="w-4" />
      )}
      <div className="flex flex-col w-full">
        <p
          className={`font-semibold mt-0.5 ${expand ? "cursor-pointer" : ""}`}
          onClick={toggleExpand}
        >
          {title}
        </p>
        <div
          className={`${isExpanded ? "max-h-[300px]" : "max-h-0"} transition-[max-height] duration-400 overflow-hidden`}
        >
          {children}
        </div>
      </div>
      {expand && (
        <button className="inline ml-auto" onClick={toggleExpand}>
          <ChevronDown
            className={`w-6 h-6 p-1 transition ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
