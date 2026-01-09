# Frontend Authentication Integration Guide

## Overview

The backend uses HTTP-only cookies for authentication. This means:

- Tokens are automatically sent with every request (no manual header management)
- Tokens are not accessible via JavaScript (XSS protection)
- Frontend must use `credentials: 'include'` for all API requests

## Base URL

```
http://localhost:3000
```

## Axios Configuration

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // Required for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

---

## Endpoints

### 1. Login / Register

**POST** `/api/v1/auth/login`

This endpoint handles both login and registration. If the user doesn't exist, they are automatically registered.

#### Request

```bash
# Login existing user
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123!"}' \
  -c cookies.txt

# Register new user (with optional name)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "password": "Password123!", "name": "John Doe"}' \
  -c cookies.txt
```

| Field    | Type   | Required | Description                                                        |
| -------- | ------ | -------- | ------------------------------------------------------------------ |
| email    | string | Yes      | User's email address                                               |
| password | string | Yes      | Password (min 6 characters)                                        |
| name     | string | No       | User's name (used for auto-registration, defaults to email prefix) |

#### Success Response - Existing User (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "isNewUser": false
  }
}
```

#### Success Response - New User (200)

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "newuser@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "isNewUser": true
  }
}
```

**Cookies Set:**

- `access_token` (HttpOnly, 60 min expiry)
- `refresh_token` (HttpOnly, 7 day expiry)

#### Error Response (401)

Only returned for existing users with incorrect password:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

---

### 2. Refresh Token

**POST** `/api/v1/auth/refresh`

Call this endpoint when access token expires to get new tokens.

#### Request

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

**Cookies Updated:**

- New `access_token` and `refresh_token` are set

#### Error Response (401)

```json
{
  "success": false,
  "message": "Refresh token is required",
  "code": "REFRESH_TOKEN_REQUIRED"
}
```

---

### 3. Logout

**POST** `/api/v1/auth/logout`

#### Request

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -b cookies.txt
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Cookies Cleared:**

- `access_token` and `refresh_token` are removed

---

### 4. Get Current User

**GET** `/api/v1/auth/me`

Requires authentication (access_token cookie).

#### Request

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -b cookies.txt
```

#### Success Response (200)

```json
{
  "success": true,
  "message": "User details fetched successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Error Response (401)

```json
{
  "success": false,
  "message": "Access token is required",
  "code": "ACCESS_TOKEN_REQUIRED"
}
```

---

## Frontend Implementation Example

### Auth Store (Zustand)

```typescript
import { create } from "zustand";
import api from "@/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    set({ user: response.data.data.user });
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data.data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ isLoading: false });
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
```

### Axios Interceptor for Auto-Refresh

```typescript
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshed = await useAuthStore.getState().refreshToken();
      if (refreshed) {
        return api(originalRequest);
      }

      // Refresh failed, redirect to login
      useAuthStore.setState({ user: null });
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## Error Codes

| Code                     | HTTP Status | Description                       |
| ------------------------ | ----------- | --------------------------------- |
| `INVALID_CREDENTIALS`    | 401         | Wrong email or password           |
| `UNAUTHORIZED`           | 401         | Not authorized to access resource |
| `TOKEN_EXPIRED`          | 401         | Access token has expired          |
| `TOKEN_INVALID`          | 401         | Token is malformed or invalid     |
| `REFRESH_TOKEN_REQUIRED` | 401         | Refresh token cookie missing      |
| `ACCESS_TOKEN_REQUIRED`  | 401         | Access token cookie missing       |
| `USER_NOT_FOUND`         | 404         | User does not exist               |
| `USER_DELETED`           | 401         | User account was deleted          |
| `VALIDATION_ERROR`       | 400         | Request body validation failed    |

---

## Test Credentials

```
Email: admin@example.com
Password: Admin123!
```

Run `pnpm seed` in the backend to create this user.
