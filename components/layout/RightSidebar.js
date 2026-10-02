"use client";

import React from "react";
import Link from "next/link";
import { Radio, Headphones, TrendingUp } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { LiveIndicator } from "@/components/rooms/LiveIndicator";
import { Footer } from "./Footer";
import { useLiveRooms, useRooms } from "@/hooks/useRooms";

export function RightSidebar({ hideRooms = false }) {
  const { rooms: liveRooms } = useLiveRooms(3);
  const { rooms: popularRooms } = useRooms({ limit: 4 });

  return (
    <aside className="space-y-4">
      {/* Live Rooms */}
      {!hideRooms && liveRooms.length > 0 && (
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-echo" />
              Live Now
            </span>
            <Link href="/rooms" className="text-xs text-echo hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {liveRooms.map((room) => (
              <div
                key={room.id}
                className="p-2.5 rounded-md bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-echo truncate">
                    {room.community_name}
                  </span>
                  <LiveIndicator size="sm" />
                </div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2 mb-2">
                  {room.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-1.5">
                    <InitialsAvatar
                      name={room.host_name || "Echo"}
                      size="xs"
                      className="ring-2 ring-white dark:ring-gray-600"
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-300 flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    {room.listener_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Rooms */}
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            Popular Rooms
          </span>
          <Link href="/popular-rooms" className="text-xs text-echo hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {popularRooms.map((room, i) => (
            <div key={room.id} className="flex items-center gap-2.5 py-1">
              <span className="text-xs font-mono text-gray-400 w-4 flex-shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {room.title}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  {room.listener_count} listening
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </aside>
  );
}
