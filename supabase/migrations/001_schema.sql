-- FanFlow schema
-- Run in Supabase SQL Editor (001 of 003)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  kickoff_at TIMESTAMPTZ NOT NULL,
  stage TEXT NOT NULL,
  group_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  google_place_id TEXT,
  stream_type TEXT NOT NULL DEFAULT 'all_matches'
    CHECK (stream_type IN ('all_matches', 'specific_events')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE venue_streams (
  venue_id UUID NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches (id) ON DELETE CASCADE,
  PRIMARY KEY (venue_id, match_id)
);

CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches (id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, match_id)
);

CREATE TABLE venue_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_kickoff ON matches (kickoff_at);
CREATE INDEX idx_attendances_match ON attendances (match_id);
CREATE INDEX idx_attendances_venue ON attendances (venue_id);
CREATE INDEX idx_venue_streams_match ON venue_streams (match_id);

CREATE VIEW public.venue_attendance_counts
WITH (security_invoker = true) AS
SELECT
  match_id,
  venue_id,
  COUNT(*)::INTEGER AS going_count
FROM attendances
GROUP BY match_id, venue_id;

GRANT SELECT ON public.venue_attendance_counts TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.prevent_attendance_after_kickoff()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  kickoff TIMESTAMPTZ;
BEGIN
  SELECT kickoff_at INTO kickoff FROM matches WHERE id = NEW.match_id;
  IF kickoff IS NOT NULL AND kickoff <= NOW() THEN
    RAISE EXCEPTION 'Match has already started';
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER attendance_kickoff_check
  BEFORE INSERT OR UPDATE ON attendances
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_attendance_after_kickoff();
