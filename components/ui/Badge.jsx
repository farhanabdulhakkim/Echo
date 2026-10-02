import React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
  ...props
}) {
  const variants = {
    default: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    primary: "bg-indigo-50 text-echo dark:bg-indigo-900/30 dark:text-indigo-300",
    live: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    outline: "bg-transparent text-gray-500 border border-gray-300 dark:border-gray-600 dark:text-gray-400",
  };

  const sizes = {
    xs: "text-[10px] px-1.5 py-0.5 rounded",
    sm: "text-xs px-2 py-0.5 rounded-md",
    md: "text-sm px-2.5 py-0.5 rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium whitespace-nowrap",
        variants[variant] || variants.default,
        sizes[size] || sizes.sm,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
