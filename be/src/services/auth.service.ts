import { getSupabaseClient } from "../db/supabase.js";
import { ERROR_CODES } from "../constants/index.js";
import { AppError } from "../middleware/index.js";
import { User, UserPublic, UserRole } from "../types/index.js";
import {
  comparePassword,
  hashPassword,
  generateTokenPair,
  verifyRefreshToken,
} from "../utils/index.js";
import { LoginInput } from "../models/user.model.js";

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
    .select("id, name, email, role, created_at, updated_at, deleted_at")
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
    .select("id, name, email, role, created_at, updated_at")
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
