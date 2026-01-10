# Content Calendar Backend

Express + TypeScript backend API with JWT authentication and Supabase database.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (HTTP-only cookies)
- **Validation**: Zod
- **Logging**: Pino
- **Documentation**: Swagger (OpenAPI 3.0)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase project

### Installation

```bash
cd be
pnpm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update the environment variables with your Supabase credentials and JWT secrets.

### Database Setup

1. Run the SQL migrations in your Supabase SQL editor:

   - `migrations/001_create_users_table.sql`
   - `migrations/002_drop_rls_policy.sql` (optional, for simpler development)
   - `migrations/003_add_google_auth_columns.sql` (for Google Sign-in support)

2. Seed the database with a test admin user:

```bash
pnpm seed
```

### Development

```bash
pnpm dev
```

Server runs at `http://localhost:3000`

### API Documentation

Swagger UI available at `http://localhost:3000/api-docs`

## Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `pnpm dev`              | Start development server with hot reload |
| `pnpm build`            | Compile TypeScript to JavaScript         |
| `pnpm start`            | Run compiled JavaScript                  |
| `pnpm seed`             | Seed database with test admin user       |
| `pnpm swagger:generate` | Generate swagger.json file               |

## API Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/api/v1/auth/login`   | Login with email/password  |
| POST   | `/api/v1/auth/google`  | Login/Register with Google |
| POST   | `/api/v1/auth/refresh` | Refresh access token       |
| POST   | `/api/v1/auth/logout`  | Logout and clear cookies   |
| GET    | `/api/v1/auth/me`      | Get current user details   |
| GET    | `/health`              | Health check               |

## Project Structure

```
be/
├── src/
│   ├── config/           # Environment & Swagger configuration
│   ├── constants/        # All strings, messages, error codes
│   ├── controllers/      # Route handlers
│   ├── db/               # Supabase client setup
│   ├── middleware/       # Auth, logging, error handling
│   ├── models/           # Zod schemas
│   ├── routes/           # Express route definitions
│   ├── services/         # Business logic
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper functions
│   └── index.ts          # Application entry point
├── migrations/           # SQL migration files
├── scripts/              # Seed and utility scripts
├── docs/                 # Documentation
├── swagger.json          # OpenAPI specification
└── package.json
```

## Test Credentials

After running `pnpm seed`:

```
Email: admin@example.com
Password: Admin123!
```

## License

ISC
