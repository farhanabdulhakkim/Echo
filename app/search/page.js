"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Hash,
  Users,
  MessageSquare,
  Radio,
  Compass,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Badge } from "@/components/ui/Badge";
import { useSearch } from "@/hooks/useSearch";

function SectionHeader({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-echo" />
      <h2 className="text-sm font-bold text-gray-800 dark:text-white">
        {label}
      </h2>
      {count > 0 && (
        <span className="ml-auto text-xs text-gray-400">
          {count} result{count !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
        {query ? `No results for "${query}"` : "Start searching"}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
        {query
          ? "Try a different term or browse topics and communities."
          : "Search for topics, communities, discussions, and live rooms."}
      </p>
      {!query && (
        <Link
          href="/discover"
          className="mt-4 text-sm text-echo hover:underline font-medium"
        >
          Browse Discover &rarr;
        </Link>
      )}
    </div>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const { query, setQuery, results, hasResults, isSearching } =
    useSearch(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery, setQuery]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      router.replace(`/search?q=${encodeURIComponent(val.trim())}`, {
        scroll: false,
      });
    } else {
      router.replace("/search", { scroll: false });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setQuery("");
      router.replace("/search", { scroll: false });
    }
  };

  return (
    <AppShell showRightSidebar={false}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-echo" />
            Search
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Find topics, communities, discussions, and live rooms.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-input"
            type="text"
            autoFocus
            placeholder="Search everything on Echo..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-echo focus:border-transparent"
            aria-label="Search Echo"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
              Searching&hellip;
            </span>
          )}
        </div>

        {!hasResults ? (
          <EmptyState query={query} />
        ) : (
          <div className="space-y-6">
            {results.topics.length > 0 && (
              <section>
                <SectionHeader
                  icon={Hash}
                  label="Topics"
                  count={results.topics.length}
                />
                <div className="space-y-2">
                  {results.topics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/topic/${topic.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-full bg-echo/10 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-4 h-4 text-echo" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-echo transition-colors">
                          {topic.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {topic.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant="subtle" size="sm">
                          {topic.category}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {topic.memberCount.toLocaleString()} members
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.communities.length > 0 && (
              <section>
                <SectionHeader
                  icon={Users}
                  label="Communities"
                  count={results.communities.length}
                />
                <div className="space-y-2">
                  {results.communities.map((c) => (
                    <Link
                      key={c.id}
                      href={`/community/${c.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 transition-colors group"
                    >
                      <InitialsAvatar name={c.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-echo transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {c.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant="subtle" size="sm">
                          {c.category}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.membersCount.toLocaleString()} members
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.discussions.length > 0 && (
              <section>
                <SectionHeader
                  icon={MessageSquare}
                  label="Discussions"
                  count={results.discussions.length}
                />
                <div className="space-y-2">
                  {results.discussions.map((d) => (
                    <Link
                      key={d.id}
                      href={`/discussion/${d.id}`}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 transition-colors group"
                    >
                      <InitialsAvatar
                        name={d.author.name}
                        size="sm"
                        className="mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-echo transition-colors line-clamp-2">
                          {d.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                          <span>{d.communityName}</span>
                          <span>&middot;</span>
                          <span>{d.author.name}</span>
                          <span>&middot;</span>
                          <span>{d.createdAt}</span>
                        </div>
                        {d.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {d.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.rooms.length > 0 && (
              <section>
                <SectionHeader
                  icon={Radio}
                  label="Live Rooms"
                  count={results.rooms.length}
                />
                <div className="space-y-2">
                  {results.rooms.map((r) => (
                    <Link
                      key={r.id}
                      href="/rooms"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <Radio className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-echo transition-colors truncate">
                          {r.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span>{r.communityName}</span>
                          <span>&middot;</span>
                          <span
                            className={
                              r.status === "live"
                                ? "text-red-500 font-medium"
                                : ""
                            }
                          >
                            {r.status === "live"
                              ? `Live · ${r.listenersCount} listening`
                              : `Upcoming · ${r.scheduledFor}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
