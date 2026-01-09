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
    REFRESH: "/refresh",
    LOGOUT: "/logout",
    ME: "/me",
  },

  // Swagger
  SWAGGER: "/api-docs",
} as const;

export const FULL_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGIN}`,
    REFRESH: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.REFRESH}`,
    LOGOUT: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGOUT}`,
    ME: `${API_BASE}${ROUTES.AUTH.BASE}${ROUTES.AUTH.ME}`,
  },
} as const;
