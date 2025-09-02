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
        indigo: "bg-indigo-100 text-indigo-800 border-indigo-300",
        success: "bg-green-100 text-green-800 border-green-700/30",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-700/30",
        danger: "bg-red-100 text-red-800 border-red-700/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariants =
  | "default"
  | "purple"
  | "info"
  | "indigo"
  | "success"
  | "warning"
  | "danger";

export default function Badge({
  children,
  variant,
  bordered = false,
}: {
  children: React.ReactNode;
  variant?: BadgeVariants;
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
