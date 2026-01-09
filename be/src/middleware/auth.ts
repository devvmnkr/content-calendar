import { Request, Response, NextFunction } from "express";
import {
  COOKIE_NAMES,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "../constants/index.js";
import { verifyAccessToken } from "../utils/index.js";
import { AppError } from "./errorHandler.js";
import { getSupabaseClient } from "../db/supabase.js";
import { User, UserPublic } from "../types/index.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken = req.cookies[COOKIE_NAMES.ACCESS_TOKEN] as
      | string
      | undefined;

    if (!accessToken) {
      throw new AppError(ERROR_CODES.ACCESS_TOKEN_REQUIRED, 401);
    }

    const payload = verifyAccessToken(accessToken);

    // Fetch user from database to ensure they still exist and aren't deleted
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at, updated_at, deleted_at")
      .eq("id", payload.userId)
      .single<User>();

    if (error || !user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 401);
    }

    if (user.deleted_at) {
      throw new AppError(ERROR_CODES.USER_DELETED, 401);
    }

    // Attach user to request (without password and deleted_at)
    const userPublic: UserPublic = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    req.user = userPublic;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    next(
      new AppError(
        ERROR_CODES.UNAUTHORIZED,
        401,
        ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED]
      )
    );
    return;
  }
  next();
}
