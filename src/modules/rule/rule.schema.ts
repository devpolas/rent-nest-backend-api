import * as z from "zod";

export const RuleTypeSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
});

export const RuleUpdateTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional(),
});

export type RuleTypeInput = z.infer<typeof RuleTypeSchema>;
export type RuleUpdateTypeInput = z.infer<typeof RuleUpdateTypeSchema>;
