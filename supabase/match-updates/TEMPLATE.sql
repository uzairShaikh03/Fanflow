-- TEMPLATE — copy to YYYY-MM-DD.sql and edit for each tournament day
-- WARNING: Clears all attendances (Going counts reset)

BEGIN;

DELETE FROM venue_streams;
DELETE FROM attendances;
DELETE FROM matches;

INSERT INTO matches (id, home_team, away_team, kickoff_at, stage, group_name) VALUES
  ('c0000001-0000-4000-8000-000000000001', 'Home Team', 'Away Team', '2026-07-04 20:00:00+00', 'Round of 16', NULL);
  -- Add more rows...

INSERT INTO venue_streams (venue_id, match_id)
SELECT v.id, m.id
FROM venues v
CROSS JOIN matches m
WHERE v.stream_type = 'all_matches';

COMMIT;
