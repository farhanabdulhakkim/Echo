// Echo Search Hook — Supabase backend, local-only search (no Reddit API)
// Phase 4: swap to full-text search index or pg_search if needed.
// Keeps the exact same hook interface as Phase 2.

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Search across topics, communities, discussions, and rooms via Supabase ilike.
 * Debounced at 300ms.
 *
 * Returns:
 *   { query, setQuery, results: { topics[], communities[], discussions[], rooms[] }, hasResults, isSearching }
 */
export function useSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({
    topics: [],
    communities: [],
    discussions: [],
    rooms: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  const runSearch = useCallback(async (q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults({ topics: [], communities: [], discussions: [], rooms: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const supabase = createClient();
    const pattern = `%${trimmed}%`;

    const [topicsRes, communitiesRes, discussionsRes, roomsRes] =
      await Promise.all([
        supabase
          .from("topics")
          .select("*")
          .or(`name.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`)
          .limit(5),
        supabase
          .from("communities")
          .select("*")
          .or(`name.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`)
          .limit(5),
        supabase
          .from("discussions")
          .select("*, author:users(id, username, display_name)")
          .or(`title.ilike.${pattern},content.ilike.${pattern},community_name.ilike.${pattern}`)
          .limit(5),
        supabase
          .from("rooms")
          .select("*")
          .or(`title.ilike.${pattern},community_name.ilike.${pattern},category.ilike.${pattern}`)
          .limit(5),
      ]);

    setResults({
      topics:      topicsRes.data      ?? [],
      communities: communitiesRes.data ?? [],
      discussions: discussionsRes.data ?? [],
      rooms:       roomsRes.data       ?? [],
    });
    setIsSearching(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => runSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  const hasResults =
    results.topics.length > 0 ||
    results.communities.length > 0 ||
    results.discussions.length > 0 ||
    results.rooms.length > 0;

  return { query, setQuery, results, hasResults, isSearching };
}