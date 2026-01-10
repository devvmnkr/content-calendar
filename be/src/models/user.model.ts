import { z } from "zod";
import { UserRole } from "../types/user.js";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(), // Optional: used for auto-registration if user doesn't exist
  includeToken: z.boolean().optional(), // Optional: include access token in response for Swagger testing
});

export const googleLoginSchema = z.object({
  credential: z.string().min(1), // Google ID token
});

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).nullable(),
  google_id: z.string().nullable(),
  avatar_url: z.string().nullable(),
  role: z.nativeEnum(UserRole),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const userPublicSchema = userSchema.omit({
  password: true,
  deleted_at: true,
  google_id: true,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type UserPublicOutput = z.infer<typeof userPublicSchema>;
