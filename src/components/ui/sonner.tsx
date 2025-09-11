"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          info: "!bg-blue-100 !text-blue-800 !border-blue-700/20",
          success: "!bg-green-100 !text-green-800 !border-green-700/20",
          warning: "!bg-orange-100 !text-orange-800 !border-orange-700/20",
          error: "!bg-red-100 !text-red-800 !border-red-700/20",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
