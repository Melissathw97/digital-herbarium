import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Eye, EyeClosed } from "lucide-react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [inputType, setInputType] = React.useState(type);

  const toggleVisibility = () => {
    if (inputType === "password") setInputType("text");
    else setInputType("password");
  };

  return (
    <div className="relative flex items-center">
      <input
        type={inputType}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {type === "password" && (
        <Button
          type="button"
          variant="ghost"
          className="absolute right-0 hover:text-lime-700 hover:bg-transparent"
          onClick={toggleVisibility}
        >
          {inputType === "password" ? <EyeClosed /> : <Eye />}
        </Button>
      )}
    </div>
  );
}

export { Input };
