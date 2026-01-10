export const MESSAGES = {
  // Success messages
  LOGIN_SUCCESS: "Login successful",
  REGISTRATION_SUCCESS: "Registration successful",
  GOOGLE_LOGIN_SUCCESS: "Google login successful",
  LOGOUT_SUCCESS: "Logout successful",
  TOKEN_REFRESHED: "Token refreshed successfully",
  USER_FETCHED: "User details fetched successfully",

  // Server messages
  SERVER_RUNNING: "Server is running on port",
  SERVER_HEALTH_OK: "Server is healthy",

  // Seed messages
  SEED_USER_CREATED: "Admin user created successfully",
  SEED_USER_EXISTS: "Admin user already exists",
  SEED_COMPLETE: "Seed completed",
} as const;

export type MessageKey = keyof typeof MESSAGES;
