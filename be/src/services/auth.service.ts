import { OAuth2Client } from "google-auth-library";
import { getSupabaseClient } from "../db/supabase.js";
import { ERROR_CODES } from "../constants/index.js";
import { env } from "../config/index.js";
import { AppError } from "../middleware/index.js";
import { User, UserPublic, UserRole } from "../types/index.js";
import {
  comparePassword,
  hashPassword,
  generateTokenPair,
  verifyRefreshToken,
} from "../utils/index.js";
import { LoginInput, GoogleLoginInput } from "../models/user.model.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResult {
  user: UserPublic;
  tokens: AuthTokens;
  isNewUser: boolean;
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const supabase = getSupabaseClient();

  // Find user by email
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", input.email)
    .is("deleted_at", null)
    .single<User>();

  let user: User;
  let isNewUser = false;

  if (!existingUser) {
    // Auto-register new user
    const hashedPassword = await hashPassword(input.password);
    const userName = input.name || input.email.split("@")[0]; // Use name or derive from email

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        name: userName,
        email: input.email,
        password: hashedPassword,
        role: UserRole.USER,
      })
      .select("*")
      .single<User>();

    if (createError || !newUser) {
      throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
    }

    user = newUser;
    isNewUser = true;
  } else {
    // Check if user is Google-only (no password)
    if (!existingUser.password) {
      throw new AppError(ERROR_CODES.PASSWORD_LOGIN_NOT_ALLOWED, 401);
    }

    // Verify password for existing user
    const isValidPassword = await comparePassword(
      input.password,
      existingUser.password
    );
    if (!isValidPassword) {
      throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 401);
    }
    user = existingUser;
  }

  // Generate tokens
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user without sensitive data
  const userPublic: UserPublic = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return { user: userPublic, tokens, isNewUser };
}

export async function googleLogin(
  input: GoogleLoginInput
): Promise<LoginResult> {
  // Verify the Google ID token
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(ERROR_CODES.GOOGLE_AUTH_FAILED, 401);
  }

  if (!payload || !payload.email) {
    throw new AppError(ERROR_CODES.GOOGLE_AUTH_FAILED, 401);
  }

  const { email, name, picture, sub: googleId } = payload;
  const supabase = getSupabaseClient();

  // Try to find user by google_id first
  let { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("google_id", googleId)
    .is("deleted_at", null)
    .single<User>();

  let user: User;
  let isNewUser = false;

  if (existingUser) {
    // User found by google_id
    user = existingUser;
  } else {
    // Try to find user by email
    const { data: userByEmail } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .is("deleted_at", null)
      .single<User>();

    if (userByEmail) {
      // Link Google account to existing user
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          google_id: googleId,
          avatar_url: picture || userByEmail.avatar_url,
        })
        .eq("id", userByEmail.id)
        .select("*")
        .single<User>();

      if (updateError || !updatedUser) {
        throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
      }

      user = updatedUser;
    } else {
      // Create new user with Google data
      const userName = name || email.split("@")[0];

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          name: userName,
          email: email,
          password: null,
          google_id: googleId,
          avatar_url: picture || null,
          role: UserRole.USER,
        })
        .select("*")
        .single<User>();

      if (createError || !newUser) {
        throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
      }

      user = newUser;
      isNewUser = true;
    }
  }

  // Generate tokens
  const tokens = generateTokenPair({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user without sensitive data
  const userPublic: UserPublic = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return { user: userPublic, tokens, isNewUser };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  // Verify refresh token
  const payload = verifyRefreshToken(refreshToken);

  const supabase = getSupabaseClient();

  // Get user from database
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role, deleted_at")
    .eq("id", payload.userId)
    .single<Pick<User, "id" | "name" | "email" | "role" | "deleted_at">>();

  if (error || !user) {
    throw new AppError(ERROR_CODES.USER_NOT_FOUND, 401);
  }

  if (user.deleted_at) {
    throw new AppError(ERROR_CODES.USER_DELETED, 401);
  }

  // Generate new token pair
  return generateTokenPair({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

export async function getUserById(userId: string): Promise<UserPublic> {
  const supabase = getSupabaseClient();

  const { data: user, error } = await supabase
    .from("users")
    .select(
      "id, name, email, role, avatar_url, created_at, updated_at, deleted_at"
    )
    .eq("id", userId)
    .single<User>();

  if (error || !user) {
    throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
  }

  if (user.deleted_at) {
    throw new AppError(ERROR_CODES.USER_DELETED, 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

// For seed script
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<UserPublic> {
  const supabase = getSupabaseClient();

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    .select("id, name, email, role, avatar_url, created_at, updated_at")
    .single<UserPublic>();

  if (error) {
    if (error.code === "23505") {
      throw new AppError(ERROR_CODES.EMAIL_ALREADY_EXISTS, 409);
    }
    throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
  }

  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const supabase = getSupabaseClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .is("deleted_at", null)
    .single<User>();

  return user;
}
