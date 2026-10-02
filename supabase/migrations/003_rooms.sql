-- =============================================================
-- ROOMS SCHEMA (Phase 4)
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

-- RLS
ALTER TABLE public.rooms             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_speakers     ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "room_participants: public read" ON public.room_participants;
DROP POLICY IF EXISTS "room_participants: auth insert" ON public.room_participants;
DROP POLICY IF EXISTS "room_participants: own update"  ON public.room_participants;

CREATE POLICY "room_participants: public read"
  ON public.room_participants FOR SELECT
  USING (true);

CREATE POLICY "room_participants: auth insert"
  ON public.room_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
