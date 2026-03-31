# TaskFlow

TaskFlow is a full-stack task and project management app with a React/Vite frontend and a Node.js/Express backend backed by Prisma + SQLite.

The frontend now uses the real backend APIs for:
- Login and session refresh
- Project creation
- Task creation, update, delete, and drag-and-drop reorder
- Comments
- Profile updates
- Dashboard and analytics data

## Stack

Frontend:
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion
- Recharts

Backend:
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- JWT auth
- bcrypt password hashing
- Zod validation

## Features

- JWT-based login with refresh-token cookies
- Project list and project detail views
- Kanban drag and drop
- Task comments
- Dashboard summary, deadlines, and team activity
- Analytics overview from backend aggregates
- Seeded demo data for local development

## Project Structure

```text
.
├─ src/                 # React frontend
├─ server/src/          # Express API
├─ prisma/              # Prisma schema, migrations, seed
├─ vite.config.ts       # Vite config, /api proxy, manual chunk splitting
├─ tsconfig.json
└─ tsconfig.server.json
```

## Environment

Copy `.env.example` to `.env` and set values as needed.

Example values:

```env
PORT=4000
CLIENT_URL=http://localhost:3000
DATABASE_URL=file:./prisma/dev.db
JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=30
BCRYPT_SALT_ROUNDS=12
```

Notes:
- `GEMINI_API_KEY` is still present in `.env.example`, but the current app flow does not depend on Gemini to run.
- The frontend expects the API at `http://localhost:4000`, proxied through Vite as `/api`.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Generate the Prisma client:

```bash
npm run prisma:generate
```

3. Apply the database migration.

Preferred:

```bash
npm run prisma:migrate
```

If Prisma migrate has trouble in your Windows environment, use the checked-in SQL migration directly:

```bash
npx prisma db execute --file prisma/migrations/20260331150000_init/migration.sql --schema prisma/schema.prisma
```

4. Seed demo data:

```bash
npm run prisma:seed
```

5. Start the backend:

```bash
npm run dev:api
```

6. Start the frontend in a second terminal:

```bash
npm run dev
```

## Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

If port `3000` is already in use, Vite may move to another port such as `3001` or `3002`.

## Demo Login

Use the seeded account:

- Email: `pimpass999@gmail.com`
- Password: `password123`

## Available Scripts

```bash
npm run dev            # Start Vite frontend
npm run dev:api        # Start backend in watch mode
npm run start:api      # Start backend once
npm run build          # Production frontend build
npm run preview        # Preview production frontend build
npm run lint           # Type-check frontend and backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## API Overview

Base path: `/api`

Auth:
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Users:
- `GET /users`
- `PATCH /users/me`

Projects:
- `GET /projects`
- `POST /projects`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId/tasks/reorder`

Tasks:
- `GET /tasks`
- `GET /tasks/:taskId`
- `POST /tasks`
- `PATCH /tasks/:taskId`
- `DELETE /tasks/:taskId`

Comments:
- `GET /tasks/:taskId/comments`
- `POST /tasks/:taskId/comments`

Dashboard:
- `GET /dashboard/summary`
- `GET /dashboard/my-tasks`
- `GET /dashboard/upcoming-deadlines`
- `GET /dashboard/team-activity`

Analytics:
- `GET /analytics/overview`

## Seed Data

The seed script creates:
- 4 users
- 3 projects
- 6 tasks
- 4 comments

This gives the UI enough real data to exercise the dashboard, project board, comments, and analytics screens immediately.

## Performance Notes

Recent improvements already included in the current implementation:
- Frontend routes are lazy-loaded
- Heavy libraries are split into separate build chunks
- Dashboard cards and analytics now use backend endpoints instead of computing everything in the browser
- The frontend uses a shared API client with token refresh and centralized request handling

## Verification

Useful checks:

```bash
npm run lint
npm run build
curl http://localhost:4000/api/health
```

## Current Status

Implemented:
- Full backend scaffold with Prisma schema, migrations, and seed data
- Authenticated REST API
- Frontend integration with backend persistence
- Task/project/comment/profile saves
- Backend-driven dashboard and analytics

Not implemented:
- Signup
- Forgot password
- OAuth login
- Notifications
- Account deletion
- File uploads
- Production deployment config
