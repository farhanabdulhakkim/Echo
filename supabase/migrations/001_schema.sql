-- =============================================================
-- Echo — Phase 3 Schema
-- Migration: 001_schema.sql
-- Run in Supabase SQL Editor or via supabase db push
-- =============================================================

-- Enable pgcrypto for gen_random_uuid() if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- 1. USERS (public profile, linked to auth.users)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  bio           TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS users_username_idx ON public.users (username);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create public profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, bio)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    ''
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- 2. TOPICS
-- =============================================================
CREATE TABLE IF NOT EXISTS public.topics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT NOT NULL DEFAULT '',
  member_count  INTEGER NOT NULL DEFAULT 0,
  category      TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS topics_slug_idx ON public.topics (slug);
CREATE INDEX IF NOT EXISTS topics_category_idx ON public.topics (category);

-- =============================================================
-- 3. COMMUNITIES
-- =============================================================
CREATE TABLE IF NOT EXISTS public.communities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  topic_id      UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  member_count  INTEGER NOT NULL DEFAULT 0,
  online_count  INTEGER NOT NULL DEFAULT 0,
  category      TEXT NOT NULL DEFAULT '',
  tags          TEXT[] DEFAULT '{}',
  rules         TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS communities_topic_id_idx ON public.communities (topic_id);
CREATE INDEX IF NOT EXISTS communities_slug_idx ON public.communities (slug);
CREATE INDEX IF NOT EXISTS communities_category_idx ON public.communities (category);

-- Full-text search index on name + description
CREATE INDEX IF NOT EXISTS communities_search_idx
  ON public.communities USING GIN (to_tsvector('english', name || ' ' || description));

-- =============================================================
-- 4. DISCUSSIONS
-- =============================================================
CREATE TABLE IF NOT EXISTS public.discussions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  content       TEXT NOT NULL DEFAULT '',
  author_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  topic_id      UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  community_id  UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  community_name TEXT NOT NULL DEFAULT '',
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS discussions_topic_id_idx ON public.discussions (topic_id);
CREATE INDEX IF NOT EXISTS discussions_community_id_idx ON public.discussions (community_id);
CREATE INDEX IF NOT EXISTS discussions_author_id_idx ON public.discussions (author_id);
CREATE INDEX IF NOT EXISTS discussions_created_at_idx ON public.discussions (created_at DESC);

CREATE OR REPLACE TRIGGER discussions_updated_at
  BEFORE UPDATE ON public.discussions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Full-text search
CREATE INDEX IF NOT EXISTS discussions_search_idx
  ON public.discussions USING GIN (to_tsvector('english', title || ' ' || content));

-- =============================================================
-- 5. COMMENTS
-- =============================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id   UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  author_id       UUID REFERENCES public.users(id) ON DELETE SET NULL,
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_discussion_id_idx ON public.comments (discussion_id);
CREATE INDEX IF NOT EXISTS comments_author_id_idx ON public.comments (author_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments (created_at ASC);

CREATE OR REPLACE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================
-- 6. ROOMS
-- =============================================================
CREATE TABLE IF NOT EXISTS public.rooms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  topic_id        UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  community_id    UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  community_name  TEXT NOT NULL DEFAULT '',
  host_id         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  host_name       TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'upcoming'
                    CHECK (status IN ('upcoming', 'live', 'ended')),
  listener_count  INTEGER NOT NULL DEFAULT 0,
  tags            TEXT[] DEFAULT '{}',
  category        TEXT NOT NULL DEFAULT '',
  scheduled_for   TEXT,
  started_at      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS rooms_topic_id_idx ON public.rooms (topic_id);
CREATE INDEX IF NOT EXISTS rooms_status_idx ON public.rooms (status);
CREATE INDEX IF NOT EXISTS rooms_listener_count_idx ON public.rooms (listener_count DESC);
CREATE INDEX IF NOT EXISTS rooms_community_id_idx ON public.rooms (community_id);

-- Full-text search
CREATE INDEX IF NOT EXISTS rooms_search_idx
  ON public.rooms USING GIN (to_tsvector('english', title || ' ' || description));

-- =============================================================
-- 7. ROOM PARTICIPANTS
-- =============================================================
CREATE TABLE IF NOT EXISTS public.room_participants (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id   UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at   TIMESTAMPTZ,
  UNIQUE (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS room_participants_room_id_idx ON public.room_participants (room_id);
CREATE INDEX IF NOT EXISTS room_participants_user_id_idx ON public.room_participants (user_id);

-- =============================================================
-- 8. ROOM SPEAKERS
-- =============================================================
CREATE TABLE IF NOT EXISTS public.room_speakers (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id   UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at   TIMESTAMPTZ,
  UNIQUE (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS room_speakers_room_id_idx ON public.room_speakers (room_id);
CREATE INDEX IF NOT EXISTS room_speakers_user_id_idx ON public.room_speakers (user_id);
