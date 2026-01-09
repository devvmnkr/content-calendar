export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  REFRESH_TOKEN_REQUIRED: "REFRESH_TOKEN_REQUIRED",
  ACCESS_TOKEN_REQUIRED: "ACCESS_TOKEN_REQUIRED",

  // User errors
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_DELETED: "USER_DELETED",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_JSON: "INVALID_JSON",

  // Server errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.INVALID_CREDENTIALS]: "Invalid email or password",
  [ERROR_CODES.UNAUTHORIZED]: "You are not authorized to access this resource",
  [ERROR_CODES.TOKEN_EXPIRED]: "Token has expired",
  [ERROR_CODES.TOKEN_INVALID]: "Invalid token",
  [ERROR_CODES.REFRESH_TOKEN_REQUIRED]: "Refresh token is required",
  [ERROR_CODES.ACCESS_TOKEN_REQUIRED]: "Access token is required",
  [ERROR_CODES.USER_NOT_FOUND]: "User not found",
  [ERROR_CODES.USER_DELETED]: "User account has been deleted",
  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: "Email already exists",
  [ERROR_CODES.VALIDATION_ERROR]: "Validation failed",
  [ERROR_CODES.INVALID_JSON]: "Invalid JSON in request body",
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "An unexpected error occurred",
  [ERROR_CODES.DATABASE_ERROR]: "Database operation failed",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
