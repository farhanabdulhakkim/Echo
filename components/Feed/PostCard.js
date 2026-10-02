"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark, MoreHorizontal, Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export function PostCard({ post, isDetail = false, onVote, onSave }) {
  const [votes, setVotes] = useState(post?.votes || 0);
  const [userVote, setUserVote] = useState(post?.upvoted ? 1 : post?.downvoted ? -1 : 0);
  const [isSaved, setIsSaved] = useState(post?.saved || false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleVote = (delta, e) => {
    e.preventDefault(); e.stopPropagation();
    if (userVote === delta) { setUserVote(0); setVotes((v) => v - delta); }
    else { setVotes((v) => (userVote === -delta ? v + delta * 2 : v + delta)); setUserVote(delta); }
  };

  return (
    <>
      <article className={cn(
        "border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900",
        !isDetail && "hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      )}>
        {/* Header: community, author, time */}
        <div className="flex items-center gap-2 mb-2 text-sm">
          <Link href={`/community/${post.communityId}`} className="flex items-center gap-2 hover:underline">
            <Avatar src={post.communityAvatar} alt={post.communityName} fallback={post.communityName} size="xs" />
            <span className="font-semibold text-gray-800 dark:text-white">{post.communityName}</span>
          </Link>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            Posted by {post.author?.name} · {post.createdAt}
          </span>
        </div>

        {/* Title */}
        {isDetail ? (
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{post.title}</h1>
        ) : (
          <Link href={`/post/${post.id}`}>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-echo transition-colors mb-2 line-clamp-2">
              {post.title}
            </h2>
          </Link>
        )}

        {/* Content */}
        {post.content && (
          <div className={cn("text-sm text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-line", !isDetail && "line-clamp-3")}>
            {post.content}
          </div>
        )}

        {/* Image */}
        {post.image && (
          <div className="relative w-full h-60 sm:h-72 rounded-md overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 700px" unoptimized />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag) => <Badge key={tag} size="xs">#{tag}</Badge>)}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Votes */}
          <div className="flex items-center gap-1">
            <button onClick={(e) => handleVote(1, e)}
              className={cn("p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", userVote === 1 && "text-green-500")}
              aria-label="Upvote">
              <ArrowBigUp className={cn("w-5 h-5", userVote === 1 && "fill-green-500")} />
            </button>
            <span className={cn("text-sm font-semibold min-w-[24px] text-center",
              userVote === 1 && "text-green-500", userVote === -1 && "text-red-500",
              userVote === 0 && "text-gray-800 dark:text-white"
            )}>{votes}</span>
            <button onClick={(e) => handleVote(-1, e)}
              className={cn("p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", userVote === -1 && "text-red-500")}
              aria-label="Downvote">
              <ArrowBigDown className={cn("w-5 h-5", userVote === -1 && "fill-red-500")} />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link href={`/post/${post.id}`}>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <MessageSquare className="w-4 h-4" /> {post.commentsCount}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShareOpen(true); }} className="gap-1 text-xs">
              <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
            </Button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSaved(!isSaved); }}
              className={cn("p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700", isSaved && "text-echo")}
              aria-label="Save">
              <Bookmark className={cn("w-4 h-4", isSaved && "fill-echo")} />
            </button>
          </div>
        </div>
      </article>

      <Modal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title="Share this post">
        <div className="flex items-center gap-2">
          <input type="text" readOnly
            value={typeof window !== "undefined" ? `${window.location.origin}/post/${post.id}` : `https://echo.community/post/${post.id}`}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm flex-1 text-gray-700 dark:text-gray-200" />
          <Button size="sm" onClick={() => {
            if (typeof window !== "undefined") { navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }
          }}>{copied ? "Copied!" : "Copy"}</Button>
        </div>
      </Modal>
    </>
  );
}
