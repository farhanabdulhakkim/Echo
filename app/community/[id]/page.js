"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Radio, MessageSquare, ArrowLeft, ChevronRight, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CommunityHeader } from "@/components/communities/CommunityHeader";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { useCommunityBySlug } from "@/hooks/useCommunities";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useRooms } from "@/hooks/useRooms";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function CommunityPage() {
  const { id: slug } = useParams();
  const { community, loading: commLoading } = useCommunityBySlug(slug);

  const communityId = community?.id;
  const { discussions, loading: discLoading } = useDiscussions({ communityId });
  const { rooms, loading: roomsLoading } = useRooms({ communityId });

  if (commLoading) {
    return (
      <AppShell showRightSidebar={true}>
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!community) {
    return (
      <AppShell showRightSidebar={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Community not found</p>
          <Link href="/communities" className="mt-3 text-sm text-echo hover:underline">&larr; Browse communities</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showRightSidebar={true}>
      <div className="space-y-5">
        <Link href="/communities" className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-echo transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Communities
        </Link>

        <CommunityHeader community={community} />

        {/* Voice stages */}
        {!roomsLoading && rooms.length > 0 && (
          <section aria-labelledby="community-rooms-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="community-rooms-heading" className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-echo" /> Voice Stages
              </h2>
              <Link href="/rooms" className="text-xs text-echo hover:underline flex items-center gap-1">
                See All <ChevronRight className="w-3 h-3" />
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
                      <span className={room.status === "live" ? "text-red-500 font-medium" : ""}>
                        &middot; {room.status === "live" ? `Live · ${room.listener_count} listening` : `Upcoming`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Discussions */}
        <section aria-labelledby="community-discussions-heading">
          <h2 id="community-discussions-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5 mb-3">
            <MessageSquare className="w-4 h-4 text-gray-500" /> Discussions
          </h2>
          {discLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : discussions.length === 0 ? (
            <div className="p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center text-sm text-gray-500">
              No discussions yet. Start the conversation!
            </div>
          ) : (
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
                        <span>{authorName}</span>
                        <span>&middot;</span>
                        <span>{new Date(disc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-echo transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
