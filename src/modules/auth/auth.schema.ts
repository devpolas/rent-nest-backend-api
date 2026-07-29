import * as z from "zod";

// Reusable fields
const emailSchema = z
  .email("Invalid email address.")
  .max(255, "Email must not exceed 255 characters.");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(32, "Password must not exceed 32 characters.");

const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters.")
  .max(255, "Name must not exceed 255 characters.");

const roleSchema = z.enum(["TENANT", "LANDLORD"]);

// Signup
export const SignupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    role: roleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

// Signin
export const SigninSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Forgot Password
export const ForgotPasswordSchema = z.object({
  email: emailSchema,
});

// Resend Verification
export const ResendVerificationSchema = z.object({
  email: emailSchema,
});

// Verify Email
export const VerifyEmailSchema = z.object({
  email: emailSchema,
  token: z.string().min(1, "Verification token is required."),
});

// Reset Password
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

// Types
export type SignupPayload = z.infer<typeof SignupSchema>;
export type SigninPayload = z.infer<typeof SigninSchema>;
export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;
export type ResendVerificationPayload = z.infer<
  typeof ResendVerificationSchema
>;
export type VerifyEmailPayload = z.infer<typeof VerifyEmailSchema>;
export type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema>;
