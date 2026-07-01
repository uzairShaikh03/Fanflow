-- FanFlow match update — 2026-07-01
-- Run in Supabase SQL Editor to refresh the bracket.
-- WARNING: This clears attendances (crowd picks reset). Venues are unchanged.
--
-- Sources: FIFA World Cup 2026 knockout schedule (Round of 32 + Round of 16)
-- Update daily during the tournament — copy this folder's pattern for new dates.

BEGIN;

DELETE FROM venue_streams;
DELETE FROM attendances;
DELETE FROM matches;

INSERT INTO matches (id, home_team, away_team, kickoff_at, stage, group_name) VALUES
  -- Round of 32 (remaining — July 1–3)
  ('c0000001-0000-4000-8000-000000000001', 'Belgium', 'Senegal', '2026-07-01 20:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000002', 'USA', 'Bosnia and Herzegovina', '2026-07-02 00:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000003', 'Spain', 'Austria', '2026-07-02 19:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000004', 'Portugal', 'Croatia', '2026-07-02 23:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000005', 'Switzerland', 'Algeria', '2026-07-03 03:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000006', 'Australia', 'Egypt', '2026-07-03 18:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000007', 'Argentina', 'Cape Verde', '2026-07-03 22:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000008', 'Colombia', 'Ghana', '2026-07-04 01:30:00+00', 'Round of 32', NULL),

  -- Round of 16 (confirmed matchups — July 4–5)
  ('c0000001-0000-4000-8000-000000000009', 'Canada', 'Morocco', '2026-07-04 17:00:00+00', 'Round of 16', NULL),
  ('c0000001-0000-4000-8000-000000000010', 'Paraguay', 'France', '2026-07-04 21:00:00+00', 'Round of 16', NULL),
  ('c0000001-0000-4000-8000-000000000011', 'Brazil', 'Norway', '2026-07-05 20:00:00+00', 'Round of 16', NULL),
  ('c0000001-0000-4000-8000-000000000012', 'Mexico', 'England', '2026-07-06 00:00:00+00', 'Round of 16', NULL);

-- Re-link all Toronto venues to every active match
INSERT INTO venue_streams (venue_id, match_id)
SELECT v.id, m.id
FROM venues v
CROSS JOIN matches m
WHERE v.stream_type = 'all_matches';

COMMIT;
