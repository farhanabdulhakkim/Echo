import React from "react";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { cn } from "@/lib/utils";

export function RoomAvatarStack({ speakers = [], max = 3, size = "sm", className = "" }) {
  const visible = speakers.slice(0, max);
  const remaining = speakers.length - max;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((speaker, idx) => (
        <InitialsAvatar
          key={idx}
          name={speaker.name}
          size={size}
          isSpeaking={speaker.isSpeaking}
          className="ring-2 ring-white dark:ring-gray-800"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 font-semibold ring-2 ring-white dark:ring-gray-800 text-xs",
            size === "xs" ? "w-6 h-6 text-[10px]" : "w-8 h-8"
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
