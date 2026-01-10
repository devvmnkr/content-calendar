export const API_PREFIX = "/api";
export const API_VERSION = "v1";
export const API_BASE = `${API_PREFIX}/${API_VERSION}`;

export const ROUTES = {
  // Health
  HEALTH: "/health",

  // Auth routes
  AUTH: {
    BASE: "/auth",
    LOGIN: "/login",
    GOOGLE: "/google",
    REFRESH: "/refresh",
    LOGOUT: "/logout",
    ME: "/me",
  },

  // Posts routes
  POSTS: {
    BASE: "/posts",
    BY_ID: "/:id",
  },

  // Swagger
  SWAGGER: "/api-docs",
} as const;

export const FULL_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGIN}`,
    GOOGLE: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.GOOGLE}`,
    REFRESH: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.REFRESH}`,
    LOGOUT: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGOUT}`,
    ME: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.ME}`,
  },
  POSTS: {
    BASE: `${API_BASE}${ROUTES.POSTS.BASE}`,
    BY_ID: `${API_BASE}${ROUTES.POSTS.BASE}${ROUTES.POSTS.BY_ID}`,
  },
} as const;
