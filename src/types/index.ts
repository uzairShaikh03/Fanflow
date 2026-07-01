export type StreamType = "all_matches" | "specific_events";

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  stage: string;
  group_name: string | null;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  lat: number | null;
  lng: number | null;
  google_place_id: string | null;
  stream_type: StreamType;
}

export interface VenueWithCount extends Venue {
  going_count: number;
}

export interface Attendance {
  id: string;
  user_id: string;
  match_id: string;
  venue_id: string;
  updated_at: string;
}
