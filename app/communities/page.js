"use client";

import React, { useState } from "react";
import { Search, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { useCommunities } from "@/hooks/useCommunities";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Technology", "Programming", "Gaming", "Startups", "Design", "Career"];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { communities, loading } = useCommunities({});

  const filtered = communities.filter((c) => {
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <AppShell showRightSidebar={false}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-echo" /> Communities
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search communities..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-echo focus:border-transparent" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn("px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((c) => <CommunityCard key={c.id} community={c} />)}
            {filtered.length === 0 && (
              <div className="col-span-full p-8 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 text-sm">
                No communities found.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
