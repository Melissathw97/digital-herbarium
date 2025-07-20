import { useMemo } from "react";
import { type Pagination } from "@/types/plant";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  pagination,
  onPageClick,
}: {
  pagination: Pagination;
  onPageClick: (page: number) => void;
}) {
  const startCount = useMemo(() => {
    if (pagination.page) {
      return (pagination.page - 1) * pagination.limit + 1;
    } else {
      return 0;
    }
  }, [pagination]);

  const endCount = useMemo(() => {
    const count = pagination.page * pagination.limit;

    if (count > pagination.total) {
      return pagination.total;
    } else {
      return count;
    }
  }, [pagination]);

  const pages = useMemo(() => {
    const pages = [];
    const range = [];
    const delta = 1;
    const current = pagination.page;
    const total = pagination.totalPages;

    if (pagination.totalPages <= 7) {
      Array.from(Array(pagination.totalPages).keys()).map((index) => {
        pages.push(index + 1);
      });
    } else {
      for (
        let i = Math.max(2, current - delta);
        i <= Math.min(total - 1, current + delta);
        i++
      ) {
        range.push(i);
      }

      const hasLeftEllipsis = current - delta > 2;
      const hasRightEllipsis = current + delta < total - 1;

      pages.push(1);
      if (hasLeftEllipsis) pages.push("ellipsis");
      pages.push(...range);
      if (hasRightEllipsis) pages.push("ellipsis");
      if (total > 1) pages.push(total);
    }

    return pages;
  }, [pagination]);

  return (
    <div className="flex items-center justify-between text-xs">
      <p>
        Showing {startCount} - {endCount} of {pagination.total} items
      </p>
      <div className="border rounded-sm flex items-center gap-1 px-1 py-1">
        <button className="w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs">
          <ChevronLeft className="size-3" />
        </button>
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="size-6 text-gray-400 grid place-items-center"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageClick(page as number)}
              className={`${page === pagination.page ? "bg-lime-700/20" : ""} size-6 grid place-items-center hover:bg-gray-100 rounded-xs`}
            >
              {page}
            </button>
          )
        )}
        <button className="w-6 h-6 grid place-items-center hover:bg-gray-100 rounded-xs">
          <ChevronRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
