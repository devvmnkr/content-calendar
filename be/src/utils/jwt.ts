import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/index.js";
import {
  JwtAccessPayload,
  JwtRefreshPayload,
  UserRole,
} from "../types/index.js";

interface TokenUser {
  id: string;
  email: string;
  role: UserRole;
}

// Parse duration string to seconds
function parseExpiresIn(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 900; // Default 15 minutes
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default:
      return 900;
  }
}

export function generateAccessToken(user: TokenUser): string {
  const payload: JwtAccessPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: "access",
  };

  const options: SignOptions = {
    expiresIn: parseExpiresIn(env.JWT_ACCESS_EXPIRES_IN),
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function generateRefreshToken(userId: string): string {
  const payload: JwtRefreshPayload = {
    userId,
    type: "refresh",
  };

  const options: SignOptions = {
    expiresIn: parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
  };

  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtAccessPayload;

  if (decoded.type !== "access") {
    throw new Error("Invalid token type");
  }

  return decoded;
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  const decoded = jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as JwtRefreshPayload;

  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  return decoded;
}

export function generateTokenPair(user: TokenUser): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user.id),
  };
}
