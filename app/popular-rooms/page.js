"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Users, Headphones } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { useRooms } from "@/hooks/useRooms";
import { useTopics } from "@/hooks/useTopics";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function PopularRoomsPage() {
  const { rooms, loading } = useRooms();
  const { topics } = useTopics();

  return (
    <AppShell showRightSidebar={false}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-echo" />
            Popular Rooms
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sorted by listeners &mdash; join the conversation.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <ol className="space-y-3">
            {rooms.map((room, index) => {
              const topic = topics.find((t) => t.id === room.topic_id);
              return (
                <li key={room.id}>
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 hover:shadow-sm transition-all group">
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className={`text-lg font-bold ${
                        index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-gray-300 dark:text-gray-600"
                      }`}>{index + 1}</span>
                    </div>

                    <InitialsAvatar name={room.host_name || "Echo"} size="md" className="flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-echo transition-colors leading-snug">
                          {room.title}
                        </p>
                        {room.status === "live" && (
                          <span className="flex items-center gap-1 flex-shrink-0 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.community_name}
                        </span>
                        {topic && (
                          <Link href={`/topic/${topic.slug}`}
                            className="flex items-center gap-1 text-echo hover:underline"
                            onClick={(e) => e.stopPropagation()}>
                            #{topic.name}
                          </Link>
                        )}
                      </div>
                      {room.tags?.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {room.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-echo font-bold text-sm">
                        <Headphones className="w-4 h-4" />
                        {room.listener_count?.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {room.status === "live" ? room.started_at : room.scheduled_for}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </AppShell>
  );
}
