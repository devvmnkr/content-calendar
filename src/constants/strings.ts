export const APP_NAME = "Content Calendar";

export const PAGE_TITLES = {
  HOME: "Home",
  DASHBOARD: "Dashboard",
  AUTH: "Authentication",
  NOT_FOUND: "Page Not Found",
} as const;

export const NAV_LABELS = {
  HOME: "Home",
  DASHBOARD: "Dashboard",
} as const;

export const MESSAGES = {
  SCHEDULE_PLACEHOLDER: "Schedule",
  PAGE_NOT_FOUND: "Page not found",
} as const;

export const ARIA_LABELS = {
  TOGGLE_SIDEBAR: "Toggle sidebar",
  TOGGLE_THEME: "Toggle theme",
  USER_AVATAR: "User avatar",
  NAVIGATION: "Main navigation",
  EXPAND_SIDEBAR: "Expand sidebar",
  COLLAPSE_SIDEBAR: "Collapse sidebar",
  SHOW_PASSWORD: "Show password",
  HIDE_PASSWORD: "Hide password",
} as const;

export const AVATAR = {
  SEED: "content-calendar-user",
  FALLBACK: "U",
} as const;

// Hero Section
export const HERO = {
  TITLE: "Plan Your Content,",
  TITLE_HIGHLIGHT: "Amplify Your Reach",
  SUBTITLE:
    "The all-in-one content calendar that helps creators organize, schedule, and track their content across all platforms.",
  CTA: "Get Started",
} as const;

// Auth Page
export const AUTH = {
  LOGIN_TITLE: "Welcome Back",
  LOGIN_SUBTITLE: "Sign in to continue to your dashboard",
  REGISTER_TITLE: "Create Account",
  REGISTER_SUBTITLE: "Get started with your content journey",
  EMAIL_LABEL: "Email",
  EMAIL_PLACEHOLDER: "you@example.com",
  PASSWORD_LABEL: "Password",
  PASSWORD_PLACEHOLDER: "Enter your password",
  NAME_LABEL: "Name",
  NAME_PLACEHOLDER: "Your name",
  LOGIN_BUTTON: "Sign In",
  REGISTER_BUTTON: "Create Account",
  GOOGLE_BUTTON: "Continue with Google",
  OR_DIVIDER: "or",
  TOGGLE_TO_REGISTER: "Don't have an account?",
  TOGGLE_TO_LOGIN: "Already have an account?",
  REGISTER_LINK: "Sign up",
  LOGIN_LINK: "Sign in",
} as const;

// Auth Errors
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
  INVALID_EMAIL: "Please enter a valid email address",
  GENERIC_ERROR: "Something went wrong. Please try again.",
} as const;

// Buttons
export const BUTTONS = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  LOADING: "Loading...",
} as const;
