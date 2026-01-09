import { UserRole } from "./user.js";

export interface JwtAccessPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: "access";
}

export interface JwtRefreshPayload {
  userId: string;
  type: "refresh";
}

export type JwtPayload = JwtAccessPayload | JwtRefreshPayload;
