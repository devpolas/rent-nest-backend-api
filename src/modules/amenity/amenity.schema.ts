import * as z from "zod";

export const AmenityTypeSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
});

export const AmenityUpdateTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional(),
});

export type AmenityTypeInput = z.infer<typeof AmenityTypeSchema>;
export type AmenityUpdateTypeInput = z.infer<typeof AmenityUpdateTypeSchema>;
