"use client";

import React from "react";
import { Flame, Sparkles, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedFilterBar({ activeSort = "hot", onSortChange, activeCategory = "All", categories = [], onCategoryChange }) {
  const sortOptions = [
    { id: "hot", label: "Hot", icon: Flame },
    { id: "new", label: "New", icon: Sparkles },
    { id: "top", label: "Top", icon: TrendingUp },
    { id: "rising", label: "Rising", icon: Clock },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mb-4">
      <div className="flex items-center gap-1 overflow-x-auto">
        {sortOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = activeSort === opt.id;
          return (
            <button key={opt.id} onClick={() => onSortChange?.(opt.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                isActive ? "bg-echo text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}>
              <Icon className="w-4 h-4" /> {opt.label}
            </button>
          );
        })}
      </div>

      {categories.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 pt-2 sm:pt-0 sm:pl-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => onCategoryChange?.(cat)}
              className={cn(
                "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}>
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
