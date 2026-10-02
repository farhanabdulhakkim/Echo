"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Radio, Headphones, Hash, ChevronRight, Flame, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LiveRoomCard } from "@/components/rooms/LiveRoomCard";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { useTopics } from "@/hooks/useTopics";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useLiveRooms } from "@/hooks/useRooms";

const FEATURED_TOPIC_SLUGS = [
  "ai", "programming", "gaming", "startups",
  "cybersecurity", "technology", "design", "career",
  "cloud", "game-development",
];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function DiscoverPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const { topics, loading: topicsLoading } = useTopics();
  const { discussions, loading: discLoading } = useDiscussions({ limit: 5 });
  const { rooms: liveRooms, loading: roomsLoading } = useLiveRooms(4);

  const featuredTopics = FEATURED_TOPIC_SLUGS
    .map((slug) => topics.find((t) => t.slug === slug))
    .filter(Boolean);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <AppShell showRightSidebar={true}>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
            <Flame className="w-5 h-5 text-echo" />
            Discover
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Topics, communities, discussions, and live conversations.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics, communities and discussions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-28 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-echo focus:border-transparent"
            aria-label="Search Echo"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-echo text-white text-xs font-medium rounded-md hover:bg-echo/90 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Trending Topics */}
        <section aria-labelledby="trending-topics-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="trending-topics-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-echo" />
              Trending Topics
            </h2>
            <Link href="/communities" className="text-xs text-echo hover:underline flex items-center gap-0.5">
              Browse all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {topicsLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)
              : featuredTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/topic/${topic.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 hover:border-echo hover:text-echo dark:hover:text-echo transition-colors font-medium"
                  >
                    <Hash className="w-3 h-3" />
                    {topic.name}
                  </Link>
                ))}
          </div>
        </section>

        {/* Popular Discussions */}
        <section aria-labelledby="discussions-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="discussions-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              Popular Discussions
            </h2>
          </div>
          <div className="space-y-2">
            {discLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-start gap-3">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              : discussions.map((disc) => {
                  const authorName = disc.author?.display_name ?? disc.author?.username ?? "Echo User";
                  return (
                    <Link
                      key={disc.id}
                      href={`/discussion/${disc.id}`}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
                    >
                      <InitialsAvatar name={authorName} size="sm" className="mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-echo transition-colors line-clamp-2">
                          {disc.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{disc.community_name}</span>
                          <span>·</span>
                          <span>{new Date(disc.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-echo transition-colors" />
                    </Link>
                  );
                })}
          </div>
        </section>

        {/* Live Now */}
        {!roomsLoading && liveRooms.length > 0 && (
          <section aria-labelledby="live-now-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="live-now-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-echo" />
                Live Now
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </h2>
              <Link href="/rooms" className="text-xs text-echo hover:underline flex items-center gap-0.5">
                View all rooms <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {liveRooms.map((room) => (
                <LiveRoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>
        )}
        {roomsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
