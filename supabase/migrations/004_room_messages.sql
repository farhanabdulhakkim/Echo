-- =============================================================
-- ROOM MESSAGES SCHEMA (Phase 4 Realtime Chat)
-- =============================================================

CREATE TABLE IF NOT EXISTS public.room_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS room_messages_room_id_idx ON public.room_messages(room_id);
CREATE INDEX IF NOT EXISTS room_messages_created_at_idx ON public.room_messages(created_at DESC);

-- RLS
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "room_messages: public read" ON public.room_messages;
DROP POLICY IF EXISTS "room_messages: auth insert" ON public.room_messages;

CREATE POLICY "room_messages: public read"
  ON public.room_messages FOR SELECT
  USING (true);

CREATE POLICY "room_messages: auth insert"
  ON public.room_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Enable Realtime for room_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
