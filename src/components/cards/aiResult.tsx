import { CircleCheck } from "lucide-react";
import { AiResult } from "@/types/plant";

export default function AiResultCard({
  result,
  isSelected,
  onSelect,
}: {
  result: AiResult;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const allowSelect = onSelect;

  return (
    <div
      className={`h-full justify-center bg-white shadow-lg rounded-lg p-4 border transition-all duration-200 hover:shadow-xl cursor-pointer relative ${isSelected ? "border-lime-700 ring-2 ring-lime-700/30" : "border-gray-200 hover:border-gray-300"}`}
      onClick={allowSelect ? () => onSelect() : undefined}
    >
      {/* Check icon positioned absolutely in top-right */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <CircleCheck className="size-5 text-white bg-lime-700 rounded-full" />
        </div>
      )}

      <div className="space-y-3">
        {/* Taxonomy section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Family
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-900 capitalize">
            {result.family}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Species
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-900 italic">
            {result.species}
          </div>
        </div>

        {/* Confidence section with visual indicator */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Confidence
            </span>
            <div className="flex items-center gap-2">
              <div className="txt-sm font-bold text-gray-900">
                {Math.round(result.confidenceLevel * 100)}%
              </div>
              <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    result.confidenceLevel * 100 >= 80
                      ? "bg-green-500"
                      : result.confidenceLevel * 100 >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${result.confidenceLevel * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
