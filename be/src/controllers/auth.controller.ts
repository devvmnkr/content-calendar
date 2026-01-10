import { Request, Response, NextFunction } from "express";
import { MESSAGES, COOKIE_NAMES, ERROR_CODES } from "../constants/index.js";
import { login, googleLogin, refreshTokens } from "../services/index.js";
import {
  sendSuccess,
  setAuthCookies,
  clearAuthCookies,
} from "../utils/index.js";
import { LoginInput, GoogleLoginInput } from "../models/user.model.js";
import { AppError } from "../middleware/index.js";
import { UserPublic } from "../types/index.js";

export async function loginHandler(
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, tokens, isNewUser } = await login(req.body);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const message = isNewUser
      ? MESSAGES.REGISTRATION_SUCCESS
      : MESSAGES.LOGIN_SUCCESS;

    // Include token in response if requested (for Swagger testing)
    const responseData = req.body.includeToken
      ? { user, isNewUser, accessToken: tokens.accessToken }
      : { user, isNewUser };

    sendSuccess(res, message, responseData);
  } catch (error) {
    next(error);
  }
}

export async function googleLoginHandler(
  req: Request<unknown, unknown, GoogleLoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, tokens, isNewUser } = await googleLogin(req.body);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const message = isNewUser
      ? MESSAGES.REGISTRATION_SUCCESS
      : MESSAGES.GOOGLE_LOGIN_SUCCESS;

    sendSuccess(res, message, { user, isNewUser });
  } catch (error) {
    next(error);
  }
}

export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN] as
      | string
      | undefined;

    if (!refreshToken) {
      throw new AppError(ERROR_CODES.REFRESH_TOKEN_REQUIRED, 401);
    }

    const tokens = await refreshTokens(refreshToken);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    sendSuccess(res, MESSAGES.TOKEN_REFRESHED);
  } catch (error) {
    next(error);
  }
}

export function logoutHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    clearAuthCookies(res);
    sendSuccess(res, MESSAGES.LOGOUT_SUCCESS);
  } catch (error) {
    next(error);
  }
}

export function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const user = req.user as UserPublic;
    sendSuccess(res, MESSAGES.USER_FETCHED, { user });
  } catch (error) {
    next(error);
  }
}
