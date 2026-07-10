import * as z from "zod";

export const ReviewSchema = z.object({
  rating: z.int().min(1).max(5),
  comment: z.string().min(10),
});

export const ReviewUpdateSchema = z.object({
  rating: z.int().min(1).max(5).optional(),
  comment: z.string().min(10).optional(),
});

export type ReviewInputType = z.infer<typeof ReviewSchema>;
export type ReviewUpdateInputType = z.infer<typeof ReviewUpdateSchema>;
