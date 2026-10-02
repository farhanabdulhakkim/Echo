import React from "react";
import { cn } from "@/lib/utils";

export function LiveIndicator({ size = "md", showText = true, status = "live", className = "" }) {
  if (status === "upcoming") {
    return (
      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        {showText && "UPCOMING"}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wide", className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      {showText && "Live"}
    </span>
  );
}
