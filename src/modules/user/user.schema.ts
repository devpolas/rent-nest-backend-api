import { z } from "zod";

// User enum

export const UserRoleEnum = z.enum([
  "TENANT",
  "LANDLORD",
  "MODERATOR",
  "ADMIN",
]);

export const UserStatusEnum = z.enum([
  "ACTIVE",
  "DEACTIVATE",
  "BLOCKED",
  "BANNED",
]);

// Create / Update User

export const UserSchema = z.object({
  name: z.string().min(2).max(100).optional(),

  phone: z.string().optional(),

  avatar: z.url().optional(),
});

export const UserUpdateSchema = UserSchema.partial();

// Admin fields

export const AdminUserSchema = UserSchema.extend({
  role: UserRoleEnum.optional(),

  status: UserStatusEnum.optional(),
});

export type UserInputType = z.infer<typeof UserSchema>;

export type UserUpdateInputType = z.infer<typeof UserUpdateSchema>;

export type AdminUserInputType = z.infer<typeof AdminUserSchema>;
