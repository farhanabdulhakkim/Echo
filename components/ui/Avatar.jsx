import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  alt = "Avatar",
  fallback = "U",
  size = "md",
  isOnline = false,
  isSpeaking = false,
  className = "",
}) {
  const sizeMap = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl",
  };

  const imageSizes = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, "2xl": 80 };

  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={cn("relative inline-block flex-shrink-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-medium text-gray-500 dark:text-gray-300",
          sizeMap[size] || sizeMap.md,
          isSpeaking && "ring-2 ring-echo ring-offset-1 ring-offset-white dark:ring-offset-gray-800"
        )}
      >
        {src && !hasError ? (
          <Image
            src={src}
            alt={alt}
            width={imageSizes[size] || 40}
            height={imageSizes[size] || 40}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            unoptimized
          />
        ) : (
          <span>{fallback ? fallback.slice(0, 2).toUpperCase() : "E"}</span>
        )}
      </div>
      {isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800",
            size === "xs" || size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5"
          )}
        />
      )}
    </div>
  );
}
