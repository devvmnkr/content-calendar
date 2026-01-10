import { create } from "zustand";
import api from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ isNewUser: boolean }>;
  googleLogin: (credential: string) => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (email, password, name) => {
    const response = await api.post("/auth/login", { email, password, name });
    set({ user: response.data.data.user });
    return { isNewUser: response.data.data.isNewUser };
  },

  googleLogin: async (credential) => {
    const response = await api.post("/auth/google", { credential });
    set({ user: response.data.data.user });
    return { isNewUser: response.data.data.isNewUser };
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null });
    }
  },

  fetchUser: async () => {
    if (get().isLoading) return;

    set({ isLoading: true });
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data.data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  refreshToken: async () => {
    try {
      await api.post("/auth/refresh");
      return true;
    } catch {
      return false;
    }
  },
}));
