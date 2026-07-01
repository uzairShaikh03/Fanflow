# Updating match listings during the World Cup

FanFlow stores matches in Supabase. During the tournament the bracket changes daily — you update matches with a short SQL script.

## How it works

- **Past matches** disappear automatically (homepage only shows `kickoff_at` in the future).
- **Wrong future matches** must be updated manually (or via a daily SQL file).
- **Venues** stay the same — only `matches`, `venue_streams`, and `attendances` change.

## Daily update (5–10 minutes)

1. Check the bracket: [FIFA World Cup 2026 schedule](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums)
2. Copy `supabase/match-updates/TEMPLATE.sql` → new file `YYYY-MM-DD.sql`
3. Edit teams, stages, and `kickoff_at` times (store in **UTC**; app displays Toronto time)
4. Supabase → **SQL Editor** → paste → **Run**
5. Refresh FanFlow — new matches appear

## Important

| Action | Effect |
|--------|--------|
| Running a match update SQL | **Resets all "Going" counts** (attendances deleted) |
| Venues | Unchanged |
| Users / logins | Unchanged |

We reset attendances because match IDs change when the bracket updates. Crowd counts for eliminated matchups aren't meaningful anyway.

## Kickoff times (UTC)

Toronto is **UTC−4** in July (EDT). Examples:

| Toronto (ET) | UTC |
|--------------|-----|
| 4:00 PM | 20:00 same day |
| 8:00 PM | 00:00 next day |
| 7:00 PM | 23:00 same day |

## When to add matches

| Stage | When to add |
|-------|-------------|
| Round of 32 | Add remaining fixtures (now) |
| Round of 16 | Add confirmed pairings (e.g. Canada vs Morocco) |
| Round of 16 (July 6–7) | Add after Round of 32 winners are known |
| Quarter-finals+ | Add once teams are confirmed |

## Files

| File | Purpose |
|------|---------|
| `2026-07-01.sql` | Today's bracket update — **run this now** |
| `TEMPLATE.sql` | Copy for future days |

## Later (post-MVP)

- Admin page to edit matches without SQL
- FIFA API or sports data feed for automatic updates
- `status` column (`scheduled` / `completed`) to keep history
