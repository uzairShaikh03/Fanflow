import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  attendanceBodySchema,
  attendanceQuerySchema,
} from "@/lib/validations/attendances";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = attendanceQuerySchema.safeParse({
      matchId: searchParams.get("matchId"),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("attendances")
      .select("id, user_id, match_id, venue_id, updated_at")
      .eq("user_id", user.id)
      .eq("match_id", parsed.data.matchId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }

    return NextResponse.json({ attendance: data });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateKey = `attendance:${user.id}:${getClientIp(request)}`;
    const rate = checkRateLimit(rateKey);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const parsed = attendanceBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { matchId, venueId } = parsed.data;

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select("kickoff_at")
      .eq("id", matchId)
      .maybeSingle();

    if (matchError || !match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (new Date(match.kickoff_at) <= new Date()) {
      return NextResponse.json(
        { error: "Match has already started" },
        { status: 403 }
      );
    }

    const { data: stream, error: streamError } = await supabase
      .from("venue_streams")
      .select("venue_id")
      .eq("match_id", matchId)
      .eq("venue_id", venueId)
      .maybeSingle();

    if (streamError || !stream) {
      return NextResponse.json({ error: "Venue not available" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("attendances")
      .upsert(
        {
          user_id: user.id,
          match_id: matchId,
          venue_id: venueId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,match_id" }
      )
      .select("id, user_id, match_id, venue_id, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }

    return NextResponse.json({ attendance: data });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
