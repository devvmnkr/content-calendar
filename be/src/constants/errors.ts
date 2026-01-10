export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  REFRESH_TOKEN_REQUIRED: "REFRESH_TOKEN_REQUIRED",
  ACCESS_TOKEN_REQUIRED: "ACCESS_TOKEN_REQUIRED",
  GOOGLE_AUTH_FAILED: "GOOGLE_AUTH_FAILED",
  PASSWORD_LOGIN_NOT_ALLOWED: "PASSWORD_LOGIN_NOT_ALLOWED",

  // User errors
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_DELETED: "USER_DELETED",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",

  // Post errors
  POST_NOT_FOUND: "POST_NOT_FOUND",
  POST_ACCESS_DENIED: "POST_ACCESS_DENIED",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
  FILE_DELETE_FAILED: "FILE_DELETE_FAILED",

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
  [ERROR_CODES.GOOGLE_AUTH_FAILED]: "Google authentication failed",
  [ERROR_CODES.PASSWORD_LOGIN_NOT_ALLOWED]:
    "This account uses Google Sign-in. Please sign in with Google.",
  [ERROR_CODES.USER_NOT_FOUND]: "User not found",
  [ERROR_CODES.USER_DELETED]: "User account has been deleted",
  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: "Email already exists",
  [ERROR_CODES.POST_NOT_FOUND]: "Post not found",
  [ERROR_CODES.POST_ACCESS_DENIED]:
    "You do not have permission to access this post",
  [ERROR_CODES.INVALID_FILE_TYPE]:
    "Invalid file type. Allowed types: images, PDF, Excel, Word documents",
  [ERROR_CODES.FILE_TOO_LARGE]: "File size exceeds the maximum limit of 10MB",
  [ERROR_CODES.FILE_UPLOAD_FAILED]: "Failed to upload file",
  [ERROR_CODES.FILE_DELETE_FAILED]: "Failed to delete file",
  [ERROR_CODES.VALIDATION_ERROR]: "Validation failed",
  [ERROR_CODES.INVALID_JSON]: "Invalid JSON in request body",
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "An unexpected error occurred",
  [ERROR_CODES.DATABASE_ERROR]: "Database operation failed",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
