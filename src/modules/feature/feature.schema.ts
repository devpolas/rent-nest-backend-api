import * as z from "zod";

export const FeatureTypeSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
});

export const FeatureUpdateTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional(),
});

export type FeatureTypeInput = z.infer<typeof FeatureTypeSchema>;
export type FeatureUpdateTypeInput = z.infer<typeof FeatureUpdateTypeSchema>;
