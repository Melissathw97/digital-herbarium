import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "px-1.5 py-0.5 text-[10px] rounded-sm font-semibold items-center gap-1 [&_svg]:!size-3 inline-flex",
  {
    variants: {
      variant: {
        default: "bg-sky-100 text-sky-800 border-sky-700/30",
        info: "bg-gray-100 text-gray-800 border-gray-700/30",
        purple: "bg-violet-100 text-violet-800 border-violet-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function Badge({
  children,
  variant,
  bordered = false,
}: {
  children: React.ReactNode;
  variant?: "default" | "purple" | "info";
  bordered?: boolean;
}) {
  return (
    <div
      className={`${cn(badgeVariants({ variant }))} ${bordered ? "border" : ""}`}
    >
      {children}
    </div>
  );
}
