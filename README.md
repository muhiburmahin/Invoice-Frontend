# Invoice Frontend

Next.js 16 + shadcn/ui app for the [Invoice API](../invoice-backend).

## Stack

- **Next.js** (App Router)
- **shadcn/ui** + Tailwind CSS v4
- **TanStack Query** — server state
- **React Hook Form** + **Zod** — forms
- **Axios** — API client (`withCredentials` for session cookies)

API calls go through a **same-origin proxy** (`/api/*` → backend) so auth cookies work in development.

## Prerequisites

- Node.js 22+
- Invoice backend running on `http://localhost:5000`

## Setup

```bash
cd invoice-frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend `.env` (required)

Point the API at this frontend:

```env
CLIENT_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

## Project structure

```
src/
  app/
    auth/          # Login, register, forgot/reset password, verify email
    (dashboard)/   # Protected app shell + dashboard
  components/
    auth/          # Forms & route guards
    layout/        # App shell, auth card
    ui/            # shadcn components
  context/         # Auth provider
  lib/             # API client
  services/        # API functions
  types/           # Shared TypeScript types
```

## Auth routes

| Path | Purpose |
|------|---------|
| `/auth/login` | Sign in |
| `/auth/register` | Sign up |
| `/auth/forgot-password` | Request reset email |
| `/auth/reset-password?token=` | Reset password (from email) |
| `/auth/verify-email?token=` | Verify email (from email) |
| `/dashboard` | Main app (protected) |
