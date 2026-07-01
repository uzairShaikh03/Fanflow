import { VenueRow } from "@/components/venue-row";
import type { VenueWithCount } from "@/types";

interface VenueListProps {
  venues: VenueWithCount[];
  matchId: string;
  selectedVenueId: string | null;
  isLoggedIn: boolean;
  matchStarted: boolean;
}

export function VenueList({
  venues,
  matchId,
  selectedVenueId,
  isLoggedIn,
  matchStarted,
}: VenueListProps) {
  if (venues.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
        No venues are streaming this match yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {venues.map((venue) => (
        <VenueRow
          key={venue.id}
          venue={venue}
          matchId={matchId}
          isSelected={venue.id === selectedVenueId}
          isLoggedIn={isLoggedIn}
          matchStarted={matchStarted}
        />
      ))}
    </div>
  );
}
