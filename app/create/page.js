"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useCommunities } from "@/hooks/useCommunities";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const { communities } = useCommunities();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Discussion posted! (Local — Phase 2)");
    router.push("/discover");
  };

  return (
    <AppShell showRightSidebar={false}>
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <PenLine className="w-5 h-5 text-echo" /> New Discussion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Community selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Community
            </label>
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-echo"
            >
              <option value="">Choose a community</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A clear, descriptive title for your discussion"
              maxLength={300}
            />
            <p className="text-xs text-gray-400 mt-1">{title.length}/300</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, question, or story..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  #{tag} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag and press Enter (max 5)"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  tagInput.trim() &&
                  tags.length < 5
                ) {
                  e.preventDefault();
                  setTags([...tags, tagInput.trim()]);
                  setTagInput("");
                }
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !selectedCommunity}
            >
              Post Discussion
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

