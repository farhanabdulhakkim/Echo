"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Search, Radio, TrendingUp, Settings } from "lucide-react";
import { BRAND } from "@/data/brand";
import { useAuth } from "@/context/AuthContext";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Search", href: "/search", icon: Search },
  { label: "Live Rooms", href: "/rooms", icon: Radio, isLive: true },
  { label: "Popular Rooms", href: "/popular-rooms", icon: TrendingUp },
];

export function Sidebar({ className = "", onItemClick }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "Echo";
  const username = profile?.username ?? user?.email?.split("@")[0] ?? "";
  return (
    <aside
      className={cn(
        "flex flex-col h-full w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 overflow-y-auto",
        className
      )}
    >
      {/* Logo */}
      <Link href="/discover" onClick={onItemClick} className="flex items-center gap-2 px-2 py-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-echo flex items-center justify-center text-white font-bold text-sm">
          E
        </div>
        <span className="font-bold text-lg text-gray-800 dark:text-white">{BRAND.name}</span>
      </Link>

      {/* Core Nav */}
      <nav className="space-y-1 flex-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-gray-100 dark:bg-gray-700 text-echo font-semibold"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-echo" : "text-gray-500 dark:text-gray-400",
                  item.isLive && !isActive && "text-red-500"
                )}
              />
              <span className="flex items-center gap-2">
                {item.label}
                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom account area */}
      <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <Link
          href="/settings"
          onClick={onItemClick}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="flex items-center gap-2 px-2 py-2 rounded-md">
          <InitialsAvatar name={displayName} size="sm" isOnline={!!user} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
              {username ? `@${username}` : "Guest"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
