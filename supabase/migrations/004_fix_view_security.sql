-- Fix: venue_attendance_counts must use SECURITY INVOKER (not DEFINER)
-- so RLS on attendances applies to whoever queries the view.
-- Run in Supabase SQL Editor if you already ran 001_schema.sql

DROP VIEW IF EXISTS public.venue_attendance_counts;

CREATE VIEW public.venue_attendance_counts
WITH (security_invoker = true) AS
SELECT
  match_id,
  venue_id,
  COUNT(*)::INTEGER AS going_count
FROM public.attendances
GROUP BY match_id, venue_id;

GRANT SELECT ON public.venue_attendance_counts TO anon, authenticated;
