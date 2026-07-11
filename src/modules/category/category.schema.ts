import * as z from "zod";

export const PropertyTypeSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
});

export const PropertyUpdateTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional(),
});

export type PropertyTypeInput = z.infer<typeof PropertyTypeSchema>;

export type PropertyUpdateTypeInput = z.infer<typeof PropertyUpdateTypeSchema>;
