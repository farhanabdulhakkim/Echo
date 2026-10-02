"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sun, Moon, Menu, Radio, Hash, Users, MessageSquare } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { BRAND } from "@/data/brand";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/hooks/useSearch";

export function TopBar({ onOpenMobileMenu }) {
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { profile, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const avatarName = profile?.display_name ?? user?.email?.split("@")[0] ?? "E";
  const searchRef = useRef(null);

  const { query, setQuery, results, hasResults, isSearching } = useSearch();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setIsDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleResultClick = () => {
    setIsDropdownOpen(false);
    setQuery("");
  };

  const showDropdown = isDropdownOpen && query.trim().length > 0;

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center px-4 sm:px-6 lg:px-8 py-3 gap-4">
        {/* Mobile menu + logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/discover" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-echo flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-bold text-gray-800 dark:text-white">{BRAND.name}</span>
          </Link>
        </div>

        {/* Search bar */}
        <div className="relative flex-1 max-w-xl hidden sm:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics, communities, discussions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-echo focus:border-transparent text-sm"
            aria-label="Search Echo"
          />

          {/* Inline dropdown results */}
          {showDropdown && (
            <div className="absolute top-full mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden">
              {!hasResults && !isSearching ? (
                <div className="py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {results.topics.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                        Topics
                      </div>
                      {results.topics.map((t) => (
                        <Link
                          key={t.id}
                          href={`/topic/${t.slug}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Hash className="w-3.5 h-3.5 text-echo flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800 dark:text-white">{t.name}</span>
                          <span className="text-xs text-gray-400 ml-auto">{t.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results.communities.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                        Communities
                      </div>
                      {results.communities.map((c) => (
                        <Link
                          key={c.id}
                          href={`/community/${c.id}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200">{c.name}</span>
                          <span className="text-xs text-gray-400 ml-auto">{c.category}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results.discussions.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                        Discussions
                      </div>
                      {results.discussions.map((d) => (
                        <Link
                          key={d.id}
                          href={`/discussion/${d.id}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{d.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results.rooms.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                        Live Rooms
                      </div>
                      {results.rooms.map((r) => (
                        <Link
                          key={r.id}
                          href="/rooms"
                          onClick={handleResultClick}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Radio className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{r.title}</span>
                          <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                            {r.listener_count} listening
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Full search link */}
                  {hasResults && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query.trim())}`}
                      onClick={handleResultClick}
                      className="block px-3 py-2 text-xs text-center text-echo hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
                    >
                      See all results for &ldquo;{query}&rdquo;
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <Link
            href="/profile"
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Profile"
          >
            <InitialsAvatar name={avatarName} size="sm" isOnline={!!user} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
