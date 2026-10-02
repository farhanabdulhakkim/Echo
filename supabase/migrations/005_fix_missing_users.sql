-- =============================================================
-- Fix missing users in public.users due to unique username constraint
-- =============================================================

-- 1. Update the trigger function to ensure unique usernames by appending part of the UUID
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, bio)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      SPLIT_PART(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 5)
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

-- 2. Retroactively insert any missing users from auth.users into public.users
INSERT INTO public.users (id, username, display_name, bio)
SELECT 
  id,
  COALESCE(
    raw_user_meta_data->>'username',
    SPLIT_PART(email, '@', 1) || '_' || substr(id::text, 1, 5)
  ),
  COALESCE(
    raw_user_meta_data->>'display_name',
    SPLIT_PART(email, '@', 1)
  ),
  ''
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
