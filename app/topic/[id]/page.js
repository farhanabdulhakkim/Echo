"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Hash, Users, MessageSquare, Radio, ChevronRight, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Badge } from "@/components/ui/Badge";
import { useTopicBySlug } from "@/hooks/useTopics";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useRooms } from "@/hooks/useRooms";
import { useCommunities } from "@/hooks/useCommunities";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function TopicPage() {
  const { id: slug } = useParams();
  const { topic, loading: topicLoading } = useTopicBySlug(slug);

  const topicId = topic?.id;
  const { discussions, loading: discLoading } = useDiscussions({ topicId });
  const { rooms, loading: roomsLoading } = useRooms({ topicId });
  const { communities, loading: commLoading } = useCommunities({ topicId });

  if (topicLoading) {
    return (
      <AppShell showRightSidebar={true}>
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!topic) {
    return (
      <AppShell showRightSidebar={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Topic not found</p>
          <Link href="/discover" className="mt-3 text-sm text-echo hover:underline">&larr; Back to Discover</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showRightSidebar={true}>
      <div className="space-y-6">
        <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-echo transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Discover
        </Link>

        {/* Topic header */}
        <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="w-14 h-14 rounded-2xl bg-echo/10 flex items-center justify-center flex-shrink-0">
            <Hash className="w-7 h-7 text-echo" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{topic.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{topic.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <Badge variant="subtle" size="sm">{topic.category}</Badge>
              <span className="text-xs text-gray-400">{topic.member_count?.toLocaleString()} members</span>
            </div>
          </div>
        </div>

        {/* Related Communities */}
        {!commLoading && communities.length > 0 && (
          <section aria-labelledby="communities-heading">
            <h2 id="communities-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5 mb-3">
              <Users className="w-4 h-4 text-gray-500" /> Communities
            </h2>
            <div className="space-y-2">
              {communities.map((c) => (
                <Link key={c.id} href={`/community/${c.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 transition-colors group">
                  <InitialsAvatar name={c.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-echo transition-colors">{c.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {c.member_count?.toLocaleString()} members &middot; {c.online_count?.toLocaleString()} online
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-echo transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Discussions */}
        {!discLoading && discussions.length > 0 && (
          <section aria-labelledby="discussions-heading">
            <h2 id="discussions-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5 mb-3">
              <MessageSquare className="w-4 h-4 text-gray-500" /> Discussions
            </h2>
            <div className="space-y-2">
              {discussions.map((disc) => {
                const authorName = disc.author?.display_name ?? disc.author?.username ?? "Echo User";
                return (
                  <Link key={disc.id} href={`/discussion/${disc.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 transition-colors group">
                    <InitialsAvatar name={authorName} size="sm" className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-echo transition-colors line-clamp-2">{disc.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{disc.community_name}</span>
                        <span>&middot;</span>
                        <span>{new Date(disc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-echo transition-colors" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Live Rooms */}
        {!roomsLoading && rooms.length > 0 && (
          <section aria-labelledby="rooms-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="rooms-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-red-500" /> Live Rooms
                {rooms.some((r) => r.status === "live") && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
              </h2>
              <Link href="/rooms" className="text-xs text-echo hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <InitialsAvatar name={room.host_name || "Echo"} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{room.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <span>{room.host_name}</span>
                      <span>&middot;</span>
                      <span className={room.status === "live" ? "text-red-500 font-medium" : ""}>
                        {room.status === "live" ? `Live · ${room.listener_count} listening` : `Upcoming · ${room.scheduled_for}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!discLoading && !roomsLoading && !commLoading && discussions.length === 0 && rooms.length === 0 && communities.length === 0 && (
          <div className="p-8 text-center rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">No content yet for this topic.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
