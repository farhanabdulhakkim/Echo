"use client";

import React from "react";
import { getInitials, getAvatarColor } from "@/data/users";
import { cn } from "@/lib/utils";

const sizeMap = {
  xs: { outer: "w-6 h-6", text: "text-[9px]" },
  sm: { outer: "w-8 h-8", text: "text-[11px]" },
  md: { outer: "w-10 h-10", text: "text-xs" },
  lg: { outer: "w-12 h-12", text: "text-sm" },
  xl: { outer: "w-16 h-16", text: "text-base" },
  "2xl": { outer: "w-20 h-20", text: "text-lg" },
};

/**
 * InitialsAvatar — never loads image URLs.
 * Generates 2-letter initials from name with a deterministic background color.
 * Use this for all user / speaker / host avatars.
 */
export function InitialsAvatar({
  name = "",
  size = "md",
  isSpeaking = false,
  isOnline = false,
  className = "",
}) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  const { outer, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className={cn("relative inline-block flex-shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold text-white select-none",
          outer,
          text,
          isSpeaking && "ring-2 ring-echo ring-offset-1 ring-offset-white dark:ring-offset-gray-800"
        )}
        style={{ backgroundColor: bgColor }}
        aria-label={name || "User"}
        title={name}
      >
        {initials}
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
