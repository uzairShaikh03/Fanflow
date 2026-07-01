-- FanFlow seed data — Toronto venues + World Cup 2026 matches
-- Run in Supabase SQL Editor (003 of 003)
-- Venue data manually curated from Watch Party Radar (Toronto)
-- Match data: see supabase/match-updates/ for latest bracket

INSERT INTO matches (id, home_team, away_team, kickoff_at, stage, group_name) VALUES
  ('c0000001-0000-4000-8000-000000000001', 'Belgium', 'Senegal', '2026-07-01 20:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000002', 'USA', 'Bosnia and Herzegovina', '2026-07-02 00:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000003', 'Spain', 'Austria', '2026-07-02 19:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000004', 'Portugal', 'Croatia', '2026-07-02 23:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000005', 'Switzerland', 'Algeria', '2026-07-03 03:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000006', 'Australia', 'Egypt', '2026-07-03 18:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000007', 'Argentina', 'Cape Verde', '2026-07-03 22:00:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000008', 'Colombia', 'Ghana', '2026-07-04 01:30:00+00', 'Round of 32', NULL),
  ('c0000001-0000-4000-8000-000000000009', 'Canada', 'Morocco', '2026-07-04 17:00:00+00', 'Round of 16', NULL),
  ('c0000001-0000-4000-8000-000000000010', 'Paraguay', 'France', '2026-07-04 21:00:00+00', 'Round of 16', NULL),
  ('c0000001-0000-4000-8000-000000000011', 'Brazil', 'Norway', '2026-07-05 20:00:00+00', 'Round of 16', NULL),
  ('c0000001-0000-4000-8000-000000000012', 'Mexico', 'England', '2026-07-06 00:00:00+00', 'Round of 16', NULL);

INSERT INTO venues (id, name, address, neighborhood, lat, lng, google_place_id, stream_type) VALUES
  ('b0000001-0000-4000-8000-000000000001', 'Real Sports Bar', '15 York St', 'Financial District', 43.6426, -79.3814, 'ChIJ-Zyf_7Q0K4gR4XNQ0Rk1RVs', 'all_matches'),
  ('b0000001-0000-4000-8000-000000000002', 'Loose Moose', '240 Adelaide St W', 'Entertainment District', 43.6487, -79.3889, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000003', 'Hoops Sports Bar & Grill', '896 College St', 'Little Italy', 43.6542, -79.4234, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000004', 'Sports Centre Cafe', '252 Victoria St', 'Downtown East', 43.6558, -79.3782, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000005', 'Fox on John', '106 John St', 'Entertainment District', 43.6475, -79.3912, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000006', 'Amsterdam BrewHouse', '245 Queens Quay W', 'Harbourfront', 43.6389, -79.3821, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000007', 'St Louis Bar & Grill', '530 Yonge St', 'Church-Wellesley', 43.6654, -79.3834, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000008', 'Batch Cookhouse', '531 King St W', 'Fashion District', 43.6448, -79.4001, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000009', 'Jack Astor''s Bar & Grill', '144 Front St W', 'Financial District', 43.6467, -79.3845, NULL, 'all_matches'),
  ('b0000001-0000-4000-8000-000000000010', 'The Fifth Social Club', '225 Richmond St W', 'Entertainment District', 43.6495, -79.3920, NULL, 'all_matches');

INSERT INTO venue_streams (venue_id, match_id)
SELECT v.id, m.id
FROM venues v
CROSS JOIN matches m
WHERE v.stream_type = 'all_matches';
