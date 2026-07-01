-- FanFlow RLS policies
-- Run in Supabase SQL Editor (002 of 003)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_suggestions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Public catalog
CREATE POLICY "matches_select_public"
  ON matches FOR SELECT
  USING (true);

CREATE POLICY "venues_select_public"
  ON venues FOR SELECT
  USING (true);

CREATE POLICY "venue_streams_select_public"
  ON venue_streams FOR SELECT
  USING (true);

-- Attendances: public counts, own writes
CREATE POLICY "attendances_select_public"
  ON attendances FOR SELECT
  USING (true);

CREATE POLICY "attendances_insert_own"
  ON attendances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attendances_update_own"
  ON attendances FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attendances_delete_own"
  ON attendances FOR DELETE
  USING (auth.uid() = user_id);

-- Venue suggestions
CREATE POLICY "venue_suggestions_select_own"
  ON venue_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "venue_suggestions_insert_own"
  ON venue_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- View inherits attendances RLS for underlying table reads
