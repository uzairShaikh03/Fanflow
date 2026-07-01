import { createClient } from "@/lib/supabase/server";
import type { Match, VenueWithCount, Attendance } from "@/types";

export async function getUpcomingMatches(): Promise<Match[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("matches")
    .select("id, home_team, away_team, kickoff_at, stage, group_name")
    .gte("kickoff_at", now)
    .order("kickoff_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getMatchById(id: string): Promise<Match | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("matches")
    .select("id, home_team, away_team, kickoff_at, stage, group_name")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getVenuesForMatch(matchId: string): Promise<VenueWithCount[]> {
  const supabase = await createClient();

  const { data: streamRows, error: streamError } = await supabase
    .from("venue_streams")
    .select("venue_id")
    .eq("match_id", matchId);

  if (streamError) throw streamError;

  const venueIds = (streamRows ?? []).map((row) => row.venue_id);
  if (venueIds.length === 0) return [];

  const { data: venues, error: venueError } = await supabase
    .from("venues")
    .select(
      "id, name, address, neighborhood, lat, lng, google_place_id, stream_type"
    )
    .in("id", venueIds);

  if (venueError) throw venueError;

  const { data: counts, error: countError } = await supabase
    .from("venue_attendance_counts")
    .select("venue_id, going_count")
    .eq("match_id", matchId);

  if (countError) throw countError;

  const countMap = new Map(
    (counts ?? []).map((row) => [row.venue_id, row.going_count as number])
  );

  const withCounts: VenueWithCount[] = (venues ?? []).map((venue) => ({
    ...venue,
    going_count: countMap.get(venue.id) ?? 0,
  }));

  return withCounts.sort((a, b) => {
    if (b.going_count !== a.going_count) return b.going_count - a.going_count;
    return a.name.localeCompare(b.name);
  });
}

export async function getUserAttendanceForMatch(
  userId: string,
  matchId: string
): Promise<Attendance | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attendances")
    .select("id, user_id, match_id, venue_id, updated_at")
    .eq("user_id", userId)
    .eq("match_id", matchId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
