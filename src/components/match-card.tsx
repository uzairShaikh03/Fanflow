import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMatchDate, formatMatchTime } from "@/lib/dates";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const date = formatMatchDate(match.kickoff_at);
  const time = formatMatchTime(match.kickoff_at);

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="transition-colors hover:border-emerald-500/40 hover:bg-card/80">
        <CardHeader className="pb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {match.stage}
            {match.group_name ? ` · Group ${match.group_name}` : ""}
          </p>
          <CardTitle className="text-lg">
            {match.home_team}{" "}
            <span className="text-muted-foreground">vs</span> {match.away_team}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-400">
            {date} · {time} ET
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
