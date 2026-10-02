"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function CreateRoomModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!user) {
      setError("You must be logged in to create a room");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const newRoom = {
        title: title.trim(),
        category: topicName.trim() || "",
        host_id: user.id,
        status: "live",
      };

      console.log("Attempting to create room with payload:", newRoom);

      const { data, error: dbError } = await supabase
        .from("rooms")
        .insert([newRoom])
        .select()
        .single();

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        throw dbError;
      }

      onClose();
      router.push(`/room/${data.id}`);
    } catch (err) {
      setError(err.message || "Failed to create room");
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Voice Room">
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Room Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-echo"
            maxLength={100}
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Topic (Optional)
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="e.g. AI Engineering"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-echo"
            maxLength={50}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Room"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
