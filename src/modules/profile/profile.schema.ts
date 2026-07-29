import * as z from "zod";

export const ProfileSchema = z.object({
  profileImage: z.string().optional(),
  bio: z.string().max(1000).optional(),
  birthdate: z.coerce.date().optional(),
});

export const ProfileUpdateSchema = z.object({
  profileImage: z.string().optional(),

  bio: z.string().max(1000).optional(),

  birthdate: z.coerce.date().optional(),
});

export type ProfileInputType = z.infer<typeof ProfileSchema>;

export type ProfileUpdateInputType = z.infer<typeof ProfileUpdateSchema>;
