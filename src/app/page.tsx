import { SetupNotice } from "@/components/setup-notice";
import { MatchCard } from "@/components/match-card";
import { hasSupabaseEnv } from "@/lib/env";
import { getUpcomingMatches } from "@/lib/matches";
import type { Match } from "@/types";

export const revalidate = 30;

export default async function HomePage() {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <Hero />
        <SetupNotice />
      </div>
    );
  }

  let matches: Match[] = [];
  let error = false;

  try {
    matches = await getUpcomingMatches();
  } catch {
    error = true;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <Hero />

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Could not load matches. Check your Supabase connection and run the
          migrations.
        </p>
      )}

      {!error && matches.length === 0 && (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No upcoming matches. Run the seed migration in Supabase SQL Editor.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      <footer className="border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
        Venue listings sourced from{" "}
        <a
          href="https://watchpartyradar.com/?city=toronto"
          className="text-emerald-400 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch Party Radar
        </a>{" "}
        by Dashmote
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Where are fans{" "}
        <span className="text-emerald-400">actually going</span>?
      </h1>
      <p className="max-w-2xl text-muted-foreground">
        Pick a World Cup match, see Toronto venues ranked by crowd size, and
        tell others where you&apos;re watching.
      </p>
    </section>
  );
}
