"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSquare, Radio, Hash, ArrowLeft, Send, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Badge } from "@/components/ui/Badge";
import { useDiscussion } from "@/hooks/useDiscussions";
import { useTopicBySlug } from "@/hooks/useTopics";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function DiscussionPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const { discussion, comments, loading, refetchComments } = useDiscussion(id);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load related rooms once we know the topic_id
  const { rooms: relatedRooms } = useRooms({ topicId: discussion?.topic_id });

  const authorName = discussion?.author?.display_name ?? discussion?.author?.username ?? "Echo User";
  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "You";

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmitting(true);
    const supabase = createClient();
    await supabase.from("comments").insert({
      discussion_id: id,
      author_id: user.id,
      content: commentText.trim(),
    });
    setCommentText("");
    setSubmitting(false);
    await refetchComments();
  };

  if (loading) {
    return (
      <AppShell showRightSidebar={true}>
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!discussion) {
    return (
      <AppShell showRightSidebar={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Discussion not found</p>
          <Link href="/discover" className="mt-3 text-sm text-echo hover:underline">&larr; Back to Discover</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showRightSidebar={true}>
      <div className="space-y-5 max-w-2xl">
        <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-echo transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Discover
        </Link>

        {/* Discussion body */}
        <article className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Link href={`/community/${discussion.communities?.slug || discussion.community_id}`}
                className="text-xs text-echo hover:underline font-medium">
                {discussion.community_name}
              </Link>
            </div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white leading-snug mb-3">
              {discussion.title}
            </h1>
            <div className="flex items-center gap-2">
              <InitialsAvatar name={authorName} size="sm" />
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{authorName}</p>
                <p className="text-[10px] text-gray-400">{new Date(discussion.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {discussion.content}
            </p>
            {discussion.tags?.length > 0 && (
              <div className="flex gap-1.5 mt-4 flex-wrap">
                {discussion.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Comments */}
        <section aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5 mb-3">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
          </h2>

          {/* Comment input */}
          {user ? (
            <form onSubmit={handleCommentSubmit}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mb-3">
              <InitialsAvatar name={displayName} size="sm" className="mt-0.5 flex-shrink-0" />
              <div className="flex-1 flex gap-2">
                <input type="text" placeholder="Share your thoughts..."
                  value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-echo focus:border-transparent"
                  aria-label="Write a comment" />
                <button type="submit" disabled={!commentText.trim() || submitting}
                  className="flex-shrink-0 p-2 rounded-md bg-echo text-white hover:bg-echo/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Submit comment">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 mb-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-center text-gray-500">
              <Link href="/auth" className="text-echo hover:underline font-medium">Sign in</Link> to join the discussion.
            </div>
          )}

          {/* Comment list */}
          {comments.length === 0 ? (
            <div className="p-6 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-400">
              Be the first to comment.
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => {
                const commenterName = comment.author?.display_name ?? comment.author?.username ?? "Echo User";
                return (
                  <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <InitialsAvatar name={commenterName} size="sm" className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{commenterName}</span>
                        <span className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Related Live Rooms */}
        {relatedRooms.length > 0 && (
          <section aria-labelledby="related-rooms-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="related-rooms-heading" className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-red-500" />
                Discuss this topic live
                {relatedRooms.some((r) => r.status === "live") && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
              </h2>
              <Link href="/rooms" className="text-xs text-echo hover:underline flex items-center gap-0.5">
                All rooms <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {relatedRooms.slice(0, 3).map((room) => (
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
      </div>
    </AppShell>
  );
}
