// Echo — useRooms hook
// Fetches rooms from Supabase with optional filters.

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * @param {{ topicId?: string, status?: string, communityId?: string, limit?: number }} opts
 * @returns {{ rooms: Array, loading: boolean, error: string|null }}
 */
export function useRooms({ topicId, status, communityId, limit } = {}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    let query = supabase
      .from("rooms")
      .select("*")
      .order("listener_count", { ascending: false });

    if (topicId)     query = query.eq("topic_id", topicId);
    if (status)      query = query.eq("status", status);
    if (communityId) query = query.eq("community_id", communityId);
    if (limit)       query = query.limit(limit);

    query.then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setRooms(data ?? []);
      setLoading(false);
    });
  }, [topicId, status, communityId, limit]);

  return { rooms, loading, error };
}

/**
 * Convenience hook: live rooms only, sorted by listener_count.
 */
export function useLiveRooms(limit) {
  return useRooms({ status: "live", limit });
}
