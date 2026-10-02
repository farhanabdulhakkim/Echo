"use client";

import React from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Badge } from "@/components/ui/Badge";

export function CommunityCard({ community }) {
  if (!community) return null;

  const fmt =
    community.membersCount >= 1000
      ? `${(community.membersCount / 1000).toFixed(1)}k`
      : community.membersCount;

  return (
    <Link
      href={`/community/${community.id}`}
      className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
    >
      <div className="flex items-start gap-3 mb-2">
        <InitialsAvatar name={community.name} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-echo transition-colors truncate">
            {community.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{community.handle}</p>
        </div>
        <Badge size="xs">{community.category}</Badge>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
        {community.description}
      </p>
      {community.tags && (
        <div className="flex flex-wrap gap-1 mb-3">
          {community.tags.slice(0, 3).map((t) => (
            <Badge key={t} size="xs">
              #{t}
            </Badge>
          ))}
        </div>
      )}
      <div className="flex items-center pt-2 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <strong className="text-gray-700 dark:text-gray-200">{fmt}</strong> members
        </span>
      </div>
    </Link>
  );
}
