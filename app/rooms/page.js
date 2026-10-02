"use client";

import React, { useState } from "react";
import { Radio, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LiveRoomCard } from "@/components/rooms/LiveRoomCard";
import { useRooms } from "@/hooks/useRooms";
import { cn } from "@/lib/utils";
import { CreateRoomModal } from "@/components/rooms/CreateRoomModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusFilter = activeTab === "all" ? undefined : activeTab;
  const { rooms, loading } = useRooms({ status: statusFilter });

  const filtered = rooms.filter((r) =>
    !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell showRightSidebar={false}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-echo" /> Voice Stages
          </h1>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Room
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search voice stages..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-echo focus:border-transparent" />
        </div>

        <div className="flex items-center gap-2">
          {[{ id: "all", label: "All" }, { id: "live", label: "Live Now" }, { id: "upcoming", label: "Upcoming" }].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                activeTab === t.id ? "bg-echo text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((room) => <LiveRoomCard key={room.id} room={room} />)}
            {filtered.length === 0 && (
              <div className="col-span-full p-8 text-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 text-sm">
                No voice stages found.
              </div>
            )}
          </div>
        )}
      </div>
      <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppShell>
  );
}
