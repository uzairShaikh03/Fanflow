"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import type { VenueWithCount } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface VenueRowProps {
  venue: VenueWithCount;
  matchId: string;
  isSelected: boolean;
  isLoggedIn: boolean;
  matchStarted: boolean;
}

export function VenueRow({
  venue,
  matchId,
  isSelected,
  isLoggedIn,
  matchStarted,
}: VenueRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCommit() {
    setError(null);

    if (!isLoggedIn) {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/matches/${matchId}`,
        },
      });
      return;
    }

    if (matchStarted) return;

    setLoading(true);
    try {
      const res = await fetch("/api/attendances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, venueId: venue.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border p-4 ${
        isSelected
          ? "border-emerald-500/50 bg-emerald-500/5"
          : "border-border bg-card"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{venue.name}</h3>
          {isSelected && (
            <Badge variant="going" className="gap-1">
              <Check className="size-3" />
              You&apos;re going
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{venue.neighborhood}</p>
        <p className="text-xs text-muted-foreground">{venue.address}</p>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge variant="going" className="text-base px-3 py-1">
          {venue.going_count} Going
        </Badge>
        {!isSelected && !matchStarted && (
          <Button
            size="sm"
            variant={isLoggedIn ? "default" : "outline"}
            onClick={handleCommit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isLoggedIn ? (
              "I'm going"
            ) : (
              "Sign in to go"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
