"use client";

import React from "react";
import { Users, Hash } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Badge } from "@/components/ui/Badge";

export function CommunityHeader({ community }) {
  if (!community) return null;

  const fmt =
    community.membersCount >= 1000
      ? `${(community.membersCount / 1000).toFixed(1)}k`
      : community.membersCount;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden mb-4">
      {/* Color banner derived from community name */}
      <div
        className="h-24 sm:h-32 w-full"
        style={{
          background: `linear-gradient(135deg, ${getGradientColors(community.name)})`,
        }}
      />

      {/* Info */}
      <div className="px-4 pb-4 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 -mt-8 mb-3">
          <div className="flex items-end gap-3">
            <div className="ring-4 ring-white dark:ring-gray-900 rounded-full">
              <InitialsAvatar name={community.name} size="xl" />
            </div>
            <div className="mb-1">
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                {community.name}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{community.handle}</p>
            </div>
          </div>
          <Badge size="xs" variant="primary">
            {community.category}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {community.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <strong className="text-gray-700 dark:text-gray-200">{fmt}</strong> Members
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <strong className="text-gray-700 dark:text-gray-200">{community.onlineCount || 240}</strong> Online
          </span>
          {community.topicId && (
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" />
              <span className="text-gray-600 dark:text-gray-300">{community.category}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Deterministic gradient colors from community name
function getGradientColors(name = "") {
  const palettes = [
    ["#6366f1", "#818cf8"],
    ["#8b5cf6", "#a78bfa"],
    ["#06b6d4", "#22d3ee"],
    ["#10b981", "#34d399"],
    ["#f59e0b", "#fbbf24"],
    ["#ef4444", "#f87171"],
    ["#ec4899", "#f472b6"],
    ["#14b8a6", "#2dd4bf"],
    ["#f97316", "#fb923c"],
    ["#64748b", "#94a3b8"],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [c1, c2] = palettes[Math.abs(hash) % palettes.length];
  return `${c1}, ${c2}`;
}
