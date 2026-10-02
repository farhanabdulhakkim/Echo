"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, FileText, MessageSquare, LogIn } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useDiscussions } from "@/hooks/useDiscussions";
import { cn } from "@/lib/utils";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("discussions");
  const tabs = [
    { id: "discussions", label: "Discussions", icon: FileText },
    { id: "comments",   label: "Comments",    icon: MessageSquare },
  ];

  const authorId = user?.id;
  const { discussions, loading: discLoading } = useDiscussions({ authorId });

  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "Echo User";
  const username    = profile?.username ?? user?.email?.split("@")[0] ?? "";
  const joinedDate  = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  if (loading) {
    return (
      <AppShell showRightSidebar={false}>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell showRightSidebar={false}>
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center gap-4">
          <LogIn className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          <p className="text-base font-medium text-gray-700 dark:text-gray-200">Sign in to view your profile</p>
          <Link href="/auth">
            <Button>Sign In / Sign Up</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showRightSidebar={false}>
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <InitialsAvatar name={displayName} size="xl" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">{displayName}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{username}</p>
              {profile?.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{profile.bio}</p>
              )}
              {joinedDate && (
                <p className="text-xs text-gray-400 mt-2">Joined {joinedDate}</p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/settings"} className="gap-1">
              <Settings className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all flex-1 justify-center",
                  activeTab === tab.id ? "bg-echo text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "discussions" && (
          discLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : discussions.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 text-sm">
              You haven&apos;t started any discussions yet.
            </div>
          ) : (
            <div className="space-y-2">
              {discussions.map((disc) => (
                <Link key={disc.id} href={`/discussion/${disc.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-echo/40 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-echo transition-colors line-clamp-2">{disc.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{disc.community_name}</span>
                      <span>&middot;</span>
                      <span>{new Date(disc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
        {activeTab === "comments" && (
          <div className="p-8 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 text-sm">
            Your comment history will appear here.
          </div>
        )}
      </div>
    </AppShell>
  );
}
