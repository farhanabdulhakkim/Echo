"use client";

import React from "react";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";

export function PostList({ posts = [], loading = false, hasMore = false, onLoadMore, emptyMessage = "No posts found." }) {
  if (loading && posts.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600" />
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
            <div className="w-full h-12 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={onLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}