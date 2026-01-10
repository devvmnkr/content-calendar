export const MESSAGES = {
  // Success messages
  LOGIN_SUCCESS: "Login successful",
  REGISTRATION_SUCCESS: "Registration successful",
  GOOGLE_LOGIN_SUCCESS: "Google login successful",
  LOGOUT_SUCCESS: "Logout successful",
  TOKEN_REFRESHED: "Token refreshed successfully",
  USER_FETCHED: "User details fetched successfully",

  // Post messages
  POST_CREATED: "Post created successfully",
  POST_FETCHED: "Post fetched successfully",
  POSTS_FETCHED: "Posts fetched successfully",
  POST_UPDATED: "Post updated successfully",
  POST_DELETED: "Post deleted successfully",

  // Server messages
  SERVER_RUNNING: "Server is running on port",
  SERVER_HEALTH_OK: "Server is healthy",

  // Seed messages
  SEED_USER_CREATED: "Admin user created successfully",
  SEED_USER_EXISTS: "Admin user already exists",
  SEED_COMPLETE: "Seed completed",
  SEED_POSTS_CREATED: "Sample posts created successfully",
  SEED_POSTS_EXIST: "Sample posts already exist",
} as const;

export type MessageKey = keyof typeof MESSAGES;
