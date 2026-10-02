"use client";

import React, { useState } from "react";
import { Headphones, Radio, Volume2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { LiveIndicator } from "./LiveIndicator";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export function LiveRoomCard({ room, className = "" }) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  if (!room) return null;
  const isLive = room.status === "live";

  return (
    <>
      <div
        className={cn(
          "border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow",
          className
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-echo truncate">
            {room.communityName}
          </span>
          <LiveIndicator status={room.status} size="sm" />
        </div>

        <h4 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 mb-2">
          {room.title}
        </h4>

        {/* Host */}
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500 dark:text-gray-400">
          <InitialsAvatar name={room.host?.name || ""} size="xs" />
          <span>Hosted by <span className="font-medium text-gray-700 dark:text-gray-200">{room.host?.name}</span></span>
        </div>

        {room.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {room.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} size="xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {/* Speaker initials stack */}
            <div className="flex items-center -space-x-1.5">
              {(room.speakers || []).slice(0, 3).map((s, i) => (
                <InitialsAvatar
                  key={i}
                  name={s.name}
                  size="xs"
                  isSpeaking={s.isSpeaking}
                  className="ring-2 ring-white dark:ring-gray-900"
                />
              ))}
              {(room.speakers || []).length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 text-[9px] font-semibold ring-2 ring-white dark:ring-gray-900 flex items-center justify-center">
                  +{(room.speakers || []).length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Headphones className="w-3 h-3" /> {room.listener_count || room.listenersCount || 0}
            </span>
          </div>
          <Button
            size="sm"
            variant={isLive ? "default" : "secondary"}
            onClick={() => window.location.href = `/room/${room.id}`}
            className="text-xs gap-1"
          >
            {isLive ? (
              <>
                <Volume2 className="w-3 h-3" /> Join
              </>
            ) : (
              <>
                <Radio className="w-3 h-3" /> RSVP
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
