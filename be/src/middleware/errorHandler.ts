import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ERROR_CODES, ERROR_MESSAGES } from "../constants/index.js";
import { sendError } from "../utils/index.js";
import { logger } from "./logger.js";
import { ApiErrorResponse } from "../types/index.js";

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;

  constructor(
    code: string,
    statusCode = 400,
    message?: string,
    errors?: Record<string, string[]>
  ) {
    super(message || ERROR_MESSAGES[code] || code);
    this.code = code;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

// JWT error names for checking (since jsonwebtoken is CJS and doesn't export error classes)
const JWT_ERROR_NAMES = {
  TOKEN_EXPIRED: "TokenExpiredError",
  JSON_WEB_TOKEN: "JsonWebTokenError",
  NOT_BEFORE: "NotBeforeError",
} as const;

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
): void {
  logger.error({ err, url: req.url, method: req.method }, err.message);

  // Handle AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.code, err.statusCode, err.errors);
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((error) => {
      const path = error.path.join(".");
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(error.message);
    });

    sendError(
      res,
      ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
      ERROR_CODES.VALIDATION_ERROR,
      400,
      errors
    );
    return;
  }

  // Handle JSON parse errors (invalid request body)
  if (err instanceof SyntaxError && "body" in err) {
    sendError(
      res,
      ERROR_MESSAGES[ERROR_CODES.INVALID_JSON],
      ERROR_CODES.INVALID_JSON,
      400
    );
    return;
  }

  // Handle JWT errors (check by error name since jsonwebtoken is CJS)
  if (err.name === JWT_ERROR_NAMES.TOKEN_EXPIRED) {
    sendError(
      res,
      ERROR_MESSAGES[ERROR_CODES.TOKEN_EXPIRED],
      ERROR_CODES.TOKEN_EXPIRED,
      401
    );
    return;
  }

  if (
    err.name === JWT_ERROR_NAMES.JSON_WEB_TOKEN ||
    err.name === JWT_ERROR_NAMES.NOT_BEFORE
  ) {
    sendError(
      res,
      ERROR_MESSAGES[ERROR_CODES.TOKEN_INVALID],
      ERROR_CODES.TOKEN_INVALID,
      401
    );
    return;
  }

  // Handle unknown errors
  sendError(
    res,
    ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    500
  );
}
