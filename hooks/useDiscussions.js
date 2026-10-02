// Echo — useDiscussions hook
// Fetches discussions from Supabase with optional filters.

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * @param {{ topicId?: string, communityId?: string, authorId?: string, limit?: number }} opts
 * @returns {{ discussions: Array, loading: boolean, error: string|null }}
 */
export function useDiscussions({ topicId, communityId, authorId, limit } = {}) {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    let query = supabase
      .from("discussions")
      .select(`
        *,
        author:users(id, username, display_name)
      `)
      .order("created_at", { ascending: false });

    if (topicId)     query = query.eq("topic_id", topicId);
    if (communityId) query = query.eq("community_id", communityId);
    if (authorId)    query = query.eq("author_id", authorId);
    if (limit)       query = query.limit(limit);

    query.then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setDiscussions(data ?? []);
      setLoading(false);
    });
  }, [topicId, communityId, authorId, limit]);

  return { discussions, loading, error };
}

/**
 * Fetch a single discussion by id, including its comments.
 * @param {string} id
 */
export function useDiscussion(id) {
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchComments = useCallback(async () => {
    if (!id) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("comments")
      .select("*, author:users(id, username, display_name)")
      .eq("discussion_id", id)
      .order("created_at", { ascending: true });
    setComments(data ?? []);
  }, [id]);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const supabase = createClient();

    // Fetch discussion
    supabase
      .from("discussions")
      .select("*, author:users(id, username, display_name)")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setDiscussion(data ?? null);
      });

    // Fetch comments
    supabase
      .from("comments")
      .select("*, author:users(id, username, display_name)")
      .eq("discussion_id", id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setComments(data ?? []);
        setLoading(false);
      });
  }, [id]);

  return { discussion, comments, loading, error, refetchComments };
}
