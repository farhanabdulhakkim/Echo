// Echo — useTopics hook
// Fetches topics from Supabase. Keeps the same shape as Phase 2 MOCK_TOPICS.

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * @returns {{ topics: Array, loading: boolean, error: string|null }}
 */
export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("topics")
      .select("*")
      .order("member_count", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setTopics(data ?? []);
        setLoading(false);
      });
  }, []);

  return { topics, loading, error };
}

/**
 * Fetch a single topic by slug.
 * @param {string} slug
 */
export function useTopicBySlug(slug) {
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const supabase = createClient();
    supabase
      .from("topics")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setTopic(data ?? null);
        setLoading(false);
      });
  }, [slug]);

  return { topic, loading, error };
}
