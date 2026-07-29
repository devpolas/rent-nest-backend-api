import * as z from "zod";

export const SocialPlatformSchema = z.enum([
  "GITHUB",
  "LINKEDIN",
  "FACEBOOK",
  "TWITTER",
  "INSTAGRAM",
  "YOUTUBE",
  "DISCORD",
  "TELEGRAM",
  "WHATSAPP",
  "WEBSITE",
]);

export const SocialProfileCreateSchema = z.object({
  platform: SocialPlatformSchema,
  url: z.url(),
});

export const SocialProfileUpdateSchema = z.object({
  url: z.url(),
});

export type SocialProfileCreateInput = z.infer<
  typeof SocialProfileCreateSchema
>;

export type SocialProfileUpdateInput = z.infer<
  typeof SocialProfileUpdateSchema
>;
