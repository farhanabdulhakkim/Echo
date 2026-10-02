// Echo — useCommunities hook
// Fetches communities from Supabase with optional filters.

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * @param {{ topicId?: string, category?: string, limit?: number }} opts
 * @returns {{ communities: Array, loading: boolean, error: string|null }}
 */
export function useCommunities({ topicId, category, limit } = {}) {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    let query = supabase
      .from("communities")
      .select("*")
      .order("member_count", { ascending: false });

    if (topicId)  query = query.eq("topic_id", topicId);
    if (category && category !== "All") query = query.eq("category", category);
    if (limit)    query = query.limit(limit);

    query.then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setCommunities(data ?? []);
      setLoading(false);
    });
  }, [topicId, category, limit]);

  return { communities, loading, error };
}

/**
 * Fetch a single community by its slug.
 * @param {string} slug
 */
export function useCommunityBySlug(slug) {
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const supabase = createClient();
    supabase
      .from("communities")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setCommunity(data ?? null);
        setLoading(false);
      });
  }, [slug]);

  return { community, loading, error };
}
