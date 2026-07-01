import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { VenueList } from "@/components/venue-list";
import { formatMatchDate, formatMatchTime } from "@/lib/dates";
import { hasSupabaseEnv } from "@/lib/env";
import {
  getMatchById,
  getUserAttendanceForMatch,
  getVenuesForMatch,
} from "@/lib/matches";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 30;

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!hasSupabaseEnv()) {
    return { title: "Match — FanFlow" };
  }
  const match = await getMatchById(id);
  if (!match) return { title: "Match not found — FanFlow" };
  return {
    title: `${match.home_team} vs ${match.away_team} — FanFlow`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;

  if (!hasSupabaseEnv()) {
    notFound();
  }

  const match = await getMatchById(id);
  if (!match) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [venues, attendance] = await Promise.all([
    getVenuesForMatch(id),
    user ? getUserAttendanceForMatch(user.id, id) : Promise.resolve(null),
  ]);

  const matchStarted = new Date(match.kickoff_at) <= new Date();
  const totalGoing = venues.reduce((sum, v) => sum + v.going_count, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-emerald-400"
      >
        ← All matches
      </Link>

      <section className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {match.stage}
          {match.group_name ? ` · Group ${match.group_name}` : ""}
        </p>
        <h1 className="text-3xl font-bold">
          {match.home_team}{" "}
          <span className="text-muted-foreground">vs</span> {match.away_team}
        </h1>
        <p className="text-emerald-400">
          {formatMatchDate(match.kickoff_at)} · {formatMatchTime(match.kickoff_at)}{" "}
          ET
        </p>
        {matchStarted ? (
          <p className="text-sm text-amber-400">This match has started — picks are locked.</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {totalGoing} fan{totalGoing === 1 ? "" : "s"} planning to watch at
            these venues
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Where the crowd is forming</h2>
        <VenueList
          venues={venues}
          matchId={id}
          selectedVenueId={attendance?.venue_id ?? null}
          isLoggedIn={Boolean(user)}
          matchStarted={matchStarted}
        />
      </section>
    </div>
  );
}
