import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.url().optional(),
});

export const UserProfileSchema = z.object({
  profileImage: z.url().optional(),
  bio: z.string().optional(),
  birthdate: z.date().optional(),
});

export const SocialPlatformEnum = z.enum([
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

export const SocialProfileSchema = z.object({
  platform: SocialPlatformEnum,
  url: z.url(),
});

export const LocationSchema = z.object({
  latitude: z.string().optional(),
  longitude: z.string().optional(),

  type: z.enum(["HOME", "CURRENT", "WORK"]),

  country: z.string().min(1),
  division: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  village: z.string().min(1),
  postalCode: z.string().min(1),

  addressLine: z.string().optional(),
});

export const CompleteUserSchema = UserSchema.extend({
  profile: UserProfileSchema.extend({
    locations: z.array(LocationSchema).optional(),
    socialProfiles: z.array(SocialProfileSchema).optional(),
  }),
});

export type UserInputType = z.input<typeof CompleteUserSchema>;
