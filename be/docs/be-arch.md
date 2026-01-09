# Backend Architecture Guide

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Runtime    | Node.js                 |
| Framework  | Express                 |
| Language   | TypeScript              |
| Database   | Supabase (PostgreSQL)   |
| Validation | Zod                     |
| Logging    | Pino                    |
| Auth       | JWT (HTTP-only cookies) |
| Docs       | Swagger (OpenAPI 3.0)   |

---

## Project Structure

```
be/
├── src/
│   ├── config/           # Environment & app configuration
│   ├── constants/        # All strings, messages, error codes
│   ├── controllers/      # Request handlers
│   ├── db/               # Database client
│   ├── middleware/       # Express middleware
│   ├── models/           # Zod validation schemas
│   ├── routes/           # Route definitions + Swagger docs
│   ├── services/         # Business logic
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   └── index.ts          # App entry point
├── migrations/           # SQL migrations
├── scripts/              # Utility scripts (seed, etc.)
└── docs/                 # Documentation
```

---

## Request Flow

```
Request → Middleware → Route → Controller → Service → Database
                                    ↓
Response ← Error Handler ← Controller ← Service
```

| Layer          | Responsibility                             |
| -------------- | ------------------------------------------ |
| **Middleware** | Logging, auth, validation                  |
| **Route**      | URL mapping, Swagger docs                  |
| **Controller** | Parse request, call service, send response |
| **Service**    | Business logic, database operations        |

---

## Adding a New Feature

### 1. Define Types (`src/types/`)

```typescript
// src/types/post.ts
export interface Post {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}
```

### 2. Create Zod Schema (`src/models/`)

```typescript
// src/models/post.model.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
```

### 3. Add Constants (`src/constants/`)

```typescript
// src/constants/messages.ts
export const MESSAGES = {
  // ... existing
  POST_CREATED: "Post created successfully",
  POST_FETCHED: "Post fetched successfully",
};

// src/constants/errors.ts
export const ERROR_CODES = {
  // ... existing
  POST_NOT_FOUND: "POST_NOT_FOUND",
};
```

### 4. Create Service (`src/services/`)

```typescript
// src/services/post.service.ts
import { getSupabaseClient } from "../db/supabase.js";
import { AppError } from "../middleware/index.js";
import { ERROR_CODES } from "../constants/index.js";
import { CreatePostInput } from "../models/post.model.js";

export async function createPost(userId: string, input: CreatePostInput) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) {
    throw new AppError(ERROR_CODES.DATABASE_ERROR, 500);
  }

  return data;
}
```

### 5. Create Controller (`src/controllers/`)

```typescript
// src/controllers/post.controller.ts
import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../constants/index.js";
import { createPost } from "../services/post.service.js";
import { sendSuccess } from "../utils/index.js";
import { CreatePostInput } from "../models/post.model.js";

export async function createPostHandler(
  req: Request<unknown, unknown, CreatePostInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const post = await createPost(req.user!.id, req.body);
    sendSuccess(res, MESSAGES.POST_CREATED, { post }, 201);
  } catch (error) {
    next(error);
  }
}
```

### 6. Create Route with Swagger (`src/routes/`)

```typescript
// src/routes/post.routes.ts
import { Router, IRouter } from "express";
import { authenticate, validateRequest } from "../middleware/index.js";
import { createPostHandler } from "../controllers/post.controller.js";
import { createPostSchema } from "../models/post.model.js";

const router: IRouter = Router();

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 */
router.post(
  "/",
  authenticate,
  validateRequest(createPostSchema),
  createPostHandler
);

export const postRoutes = router;
```

### 7. Register Route (`src/routes/index.ts`)

```typescript
import { postRoutes } from "./post.routes.js";

router.use("/posts", postRoutes);
```

### 8. Export from Barrel Files

```typescript
// src/services/index.ts
export * from "./post.service.js";

// src/controllers/index.ts
export * from "./post.controller.js";
```

---

## Patterns & Conventions

### No Hardcoded Strings

```typescript
// ❌ Bad
res.json({ message: "User created" });

// ✅ Good
import { MESSAGES } from "../constants/index.js";
sendSuccess(res, MESSAGES.USER_CREATED, data);
```

### Error Handling

```typescript
// Throw AppError for known errors
throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);

// With custom message
throw new AppError(ERROR_CODES.VALIDATION_ERROR, 400, "Email is invalid");

// With field errors
throw new AppError(ERROR_CODES.VALIDATION_ERROR, 400, undefined, {
  email: ["Invalid format"],
});
```

### Response Format

```typescript
// Success
sendSuccess(res, MESSAGES.SUCCESS, { user }, 200);

// Error (handled by errorHandler middleware)
sendError(res, message, code, statusCode, errors);
```

### Authentication

```typescript
// Protected route
router.get("/me", authenticate, getMeHandler);

// Access user in controller
const userId = req.user!.id;
```

### Validation

```typescript
// Apply to route
router.post("/", validateRequest(schema), handler);

// Schema validates req.body by default
// For query params: validateRequest(schema, "query")
// For URL params: validateRequest(schema, "params")
```

---

## Database Operations

```typescript
const supabase = getSupabaseClient();

// Select
const { data, error } = await supabase
  .from("users")
  .select("id, name, email")
  .eq("id", userId)
  .single();

// Insert
const { data, error } = await supabase
  .from("posts")
  .insert({ title, user_id })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from("posts")
  .update({ title })
  .eq("id", postId)
  .select()
  .single();

// Soft delete
const { error } = await supabase
  .from("users")
  .update({ deleted_at: new Date().toISOString() })
  .eq("id", userId);
```

---

## File Naming

| Type        | Convention             | Example                |
| ----------- | ---------------------- | ---------------------- |
| Types       | `{name}.ts`            | `user.ts`, `post.ts`   |
| Models      | `{name}.model.ts`      | `user.model.ts`        |
| Services    | `{name}.service.ts`    | `auth.service.ts`      |
| Controllers | `{name}.controller.ts` | `auth.controller.ts`   |
| Routes      | `{name}.routes.ts`     | `auth.routes.ts`       |
| Middleware  | `{name}.ts`            | `auth.ts`, `logger.ts` |

---

## API Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": {
    "field": ["Error message"]
  }
}
```

---

## Environment Variables

All env vars are validated at startup via Zod in `src/config/env.ts`.

```typescript
import { env } from "./config/index.js";

// Access validated env vars
env.PORT;
env.SUPABASE_PROJECT_URL;
env.JWT_ACCESS_SECRET;
```

---

## Logging

```typescript
import { logger } from "./middleware/logger.js";

logger.info("User logged in");
logger.error({ err }, "Database error");
logger.debug({ userId }, "Fetching user");
```

Log format:

- **Success**: `[datetime] POST /api/v1/auth/login 200 - 45ms`
- **Error**: `[datetime] POST /api/v1/auth/login 401 - [Req: {...}] [Res: {...}]`
