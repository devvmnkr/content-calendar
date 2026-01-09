import { Response, CookieOptions } from "express";
import { env } from "../config/index.js";
import { COOKIE_NAMES, COOKIE_MAX_AGE } from "../constants/index.js";

function getBaseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    domain: env.COOKIE_DOMAIN,
    path: "/",
  };
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  const baseOptions = getBaseCookieOptions();

  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...baseOptions,
    maxAge: COOKIE_MAX_AGE.ACCESS_TOKEN,
  });

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...baseOptions,
    maxAge: COOKIE_MAX_AGE.REFRESH_TOKEN,
  });
}

export function clearAuthCookies(res: Response): void {
  const baseOptions = getBaseCookieOptions();

  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, baseOptions);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, baseOptions);
}
