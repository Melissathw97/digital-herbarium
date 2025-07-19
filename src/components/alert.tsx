import { ChevronDown, Info } from "lucide-react";

export default function Alert({
  children,
  title,
  expand = false,
  isExpanded = true,
  toggleExpand,
}: {
  children?: React.ReactNode;
  title: string;
  expand?: boolean;
  isExpanded?: boolean;
  toggleExpand?: () => void;
}) {
  return (
    <div className="flex gap-2 items-start bg-blue-50 p-2 px-4 text-blue-500 rounded-sm mb-5">
      <Info className="w-4" />
      <div className="flex flex-col w-full">
        <p
          className="font-semibold mt-0.5 cursor-pointer"
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
