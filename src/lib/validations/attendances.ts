import { z } from "zod";

export const attendanceBodySchema = z.object({
  matchId: z.string().uuid("Invalid match ID"),
  venueId: z.string().uuid("Invalid venue ID"),
});

export const attendanceQuerySchema = z.object({
  matchId: z.string().uuid("Invalid match ID"),
});
