"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Search, Radio, TrendingUp, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

const mobileTabs = [
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Search", href: "/search", icon: Search },
  { label: "Live Rooms", href: "/rooms", icon: Radio, isLive: true },
  { label: "Popular", href: "/popular-rooms", icon: TrendingUp },
];

export function MobileNav({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-gray-800 z-10 shadow-lg">
            <div className="p-3 flex justify-end border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onItemClick={onClose} className="border-r-0 w-full" />
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 flex items-center justify-around"
        aria-label="Mobile navigation"
      >
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center p-1.5 text-[10px] font-medium min-w-[52px] relative",
                isActive ? "text-echo" : "text-gray-400"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {tab.isLive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </div>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
