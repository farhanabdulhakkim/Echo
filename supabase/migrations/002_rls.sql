-- =============================================================
-- Echo — Phase 3 Row Level Security
-- Migration: 002_rls.sql
-- =============================================================

-- Enable RLS on all public tables
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_speakers     ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- USERS
-- =============================================================
DROP POLICY IF EXISTS "users: public read"           ON public.users;
DROP POLICY IF EXISTS "users: own update"            ON public.users;

-- Anyone can read basic profile info
CREATE POLICY "users: public read"
  ON public.users FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "users: own update"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================
-- TOPICS (read-only for public, no user-created topics in P3)
-- =============================================================
DROP POLICY IF EXISTS "topics: public read" ON public.topics;

CREATE POLICY "topics: public read"
  ON public.topics FOR SELECT
  USING (true);

-- =============================================================
-- COMMUNITIES (read-only for public in P3)
-- =============================================================
DROP POLICY IF EXISTS "communities: public read" ON public.communities;

CREATE POLICY "communities: public read"
  ON public.communities FOR SELECT
  USING (true);

-- =============================================================
-- DISCUSSIONS
-- =============================================================
DROP POLICY IF EXISTS "discussions: public read"    ON public.discussions;
DROP POLICY IF EXISTS "discussions: auth insert"    ON public.discussions;
DROP POLICY IF EXISTS "discussions: own update"     ON public.discussions;
DROP POLICY IF EXISTS "discussions: own delete"     ON public.discussions;

CREATE POLICY "discussions: public read"
  ON public.discussions FOR SELECT
  USING (true);

CREATE POLICY "discussions: auth insert"
  ON public.discussions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

CREATE POLICY "discussions: own update"
  ON public.discussions FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "discussions: own delete"
  ON public.discussions FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================================
-- COMMENTS
-- =============================================================
DROP POLICY IF EXISTS "comments: public read"   ON public.comments;
DROP POLICY IF EXISTS "comments: auth insert"   ON public.comments;
DROP POLICY IF EXISTS "comments: own update"    ON public.comments;
DROP POLICY IF EXISTS "comments: own delete"    ON public.comments;

CREATE POLICY "comments: public read"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "comments: auth insert"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

CREATE POLICY "comments: own update"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments: own delete"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================================
-- ROOMS
-- =============================================================
DROP POLICY IF EXISTS "rooms: public read"   ON public.rooms;
DROP POLICY IF EXISTS "rooms: host insert"   ON public.rooms;
DROP POLICY IF EXISTS "rooms: host update"   ON public.rooms;
DROP POLICY IF EXISTS "rooms: host delete"   ON public.rooms;

CREATE POLICY "rooms: public read"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "rooms: host insert"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = host_id);

CREATE POLICY "rooms: host update"
  ON public.rooms FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "rooms: host delete"
  ON public.rooms FOR DELETE
  USING (auth.uid() = host_id);

-- =============================================================
-- ROOM PARTICIPANTS
-- =============================================================
DROP POLICY IF EXISTS "room_participants: public read" ON public.room_participants;
DROP POLICY IF EXISTS "room_participants: auth insert" ON public.room_participants;
DROP POLICY IF EXISTS "room_participants: own update"  ON public.room_participants;

CREATE POLICY "room_participants: public read"
  ON public.room_participants FOR SELECT
  USING (true);

CREATE POLICY "room_participants: auth insert"
  ON public.room_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "room_participants: own update"
  ON public.room_participants FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================
-- ROOM SPEAKERS
-- =============================================================
DROP POLICY IF EXISTS "room_speakers: public read"   ON public.room_speakers;
DROP POLICY IF EXISTS "room_speakers: host manage"   ON public.room_speakers;

CREATE POLICY "room_speakers: public read"
  ON public.room_speakers FOR SELECT
  USING (true);

-- Only the room host can add/remove speakers
CREATE POLICY "room_speakers: host manage"
  ON public.room_speakers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms r
      WHERE r.id = room_id AND r.host_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rooms r
      WHERE r.id = room_id AND r.host_id = auth.uid()
    )
  );
