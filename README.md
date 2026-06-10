# Invoice Frontend

Next.js 16 web app for the [Invoice API](https://github.com/muhiburmahin/Invoice-Backend) — multi-tenant invoice SaaS with marketing site, business dashboard, and admin panel.

**Live app:** `https://invoice-kohl-one.vercel.app`  
**Backend API:** `https://invoice-backend-red-nine.vercel.app`

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| State | TanStack Query + Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios (`withCredentials` for session cookies) |
| Auth | Better Auth (via backend proxy) |
| Deploy | Vercel |

---

## Prerequisites

- Node.js 20+
- [Invoice Backend](https://github.com/muhiburmahin/Invoice-Backend) running locally or deployed on Vercel
- PostgreSQL database (via backend)

---

## Quick start (local)

```bash
git clone <your-frontend-repo-url>
cd invoice-frontend

cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Start the backend in a separate terminal:

```bash
cd ../invoice-backend
npm run dev   # http://localhost:5000
```

---

## Environment variables

Copy `.env.example` → `.env` (and optionally `.env.local` for local overrides).

### Local development

```env
API_URL=http://localhost:5000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Description |
|----------|-------------|
| `API_URL` | Server-side proxy target (Next.js rewrites) |
| `NEXT_PUBLIC_BACKEND_URL` | Same as `API_URL` — used in `next.config.ts` |
| `NEXT_PUBLIC_API_BASE_URL` | Leave **empty** — browser uses same-origin `/api` (required for cookies & OAuth) |
| `NEXT_PUBLIC_APP_URL` | Public frontend URL — must match backend `CLIENT_URL` |
| `NEXT_PUBLIC_SHOW_DEMO_LOGIN` | Set `true` to show demo accounts on login page in production |

### Production (Vercel Dashboard)

```env
API_URL=https://invoice-backend-red-nine.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://invoice-backend-red-nine.vercel.app
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_URL=https://invoice-kohl-one.vercel.app
NEXT_PUBLIC_SHOW_DEMO_LOGIN=true
```

> `.env` files are **not** uploaded to Vercel — set variables in **Settings → Environment Variables**, then redeploy.

---

## API proxy (same-origin)

All API calls go through the Next.js frontend origin so session cookies work:

```
Browser  →  localhost:3000/api/*       →  localhost:5000/api/*
Browser  →  frontend.vercel.app/api/*  →  backend.vercel.app/api/*
```

Configured in `next.config.ts`:

```ts
/api/auth/:path*  →  backend /api/auth/:path*
/api/:path*       →  backend /api/:path*
/health/:path*    →  backend /health/:path*
```

**Keep `NEXT_PUBLIC_API_BASE_URL` empty** so Axios uses same-origin requests.

---

## Authentication

### Email / password

- Login: `/auth/login`
- Register: `/auth/register`
- Session cookie: `better-auth.session_token` (dev) or `__Secure-better-auth.session_token` (production HTTPS)

### Google OAuth

OAuth must use the **frontend** redirect URI in Google Cloud Console:

```
http://localhost:3000/api/auth/callback/google
https://invoice-kohl-one.vercel.app/api/auth/callback/google
```

**Backend** must have:

```env
CLIENT_URL=https://invoice-kohl-one.vercel.app
BETTER_AUTH_URL=https://invoice-kohl-one.vercel.app
```

### Route protection (`src/proxy.ts`)

Next.js 16 proxy guards authenticated routes — redirects to `/auth/login` if no session cookie:

| Protected paths |
|-----------------|
| `/dashboard/*` |
| `/admin/*` |
| `/clients/*` |
| `/invoices/*` |
| `/payments/*` |
| `/settings/*` |
| `/recurring/*` |

Public routes (home, marketing, auth pages) remain accessible while logged in.

---

## Demo login

Demo accounts appear on `/auth/login` when:

- `NODE_ENV=development` (automatic), or
- `NEXT_PUBLIC_SHOW_DEMO_LOGIN=true` (production)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `mdmahincse@gmail.com` | `123456aA@` |
| Business user | `muhiburmahin.edu@gmail.com` | `123456aA@` |

> Remove `NEXT_PUBLIC_SHOW_DEMO_LOGIN` before real production launch.

---

## Deploy to Vercel

```bash
cd invoice-frontend
vercel --prod
```

### Vercel environment variables

| Variable | Value |
|----------|--------|
| `API_URL` | `https://invoice-backend-red-nine.vercel.app` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://invoice-backend-red-nine.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://invoice-kohl-one.vercel.app` |
| `NEXT_PUBLIC_API_BASE_URL` | *(leave empty)* |
| `NEXT_PUBLIC_SHOW_DEMO_LOGIN` | `true` *(optional, for mentor demo)* |

After env changes → **Redeploy**.

---

## Routes

### Marketing (public)

| Path | Page |
|------|------|
| `/` | Home |
| `/features` | Features |
| `/pricing` | Pricing |
| `/faq` | FAQ |
| `/contact` | Contact |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Auth (public)

| Path | Page |
|------|------|
| `/auth/login` | Sign in |
| `/auth/register` | Sign up |
| `/auth/forgot-password` | Forgot password |
| `/auth/reset-password` | Reset password |
| `/auth/verify-email` | Email verification |
| `/auth/callback` | OAuth callback |

### Business dashboard (protected)

| Path | Page |
|------|------|
| `/dashboard` | Overview |
| `/clients` | Client list |
| `/clients/[id]` | Client detail |
| `/invoices` | Invoice list |
| `/invoices/new` | Create invoice |
| `/invoices/[id]` | Invoice detail |
| `/payments` | Payments |
| `/recurring` | Recurring schedules |
| `/settings` | Account settings |
| `/settings/business` | Business profile |
| `/settings/billing` | Subscription & billing |

### Admin panel (protected, staff only)

| Path | Page |
|------|------|
| `/admin` | Admin overview |
| `/admin/users` | User management |
| `/admin/users/[id]` | User detail |
| `/admin/activity-logs` | Audit logs |
| `/admin/jobs` | Scheduled jobs |

### Client portal (public, token-based)

| Path | Page |
|------|------|
| `/portal/[token]` | Client portal home |
| `/portal/[token]/invoices/[id]` | Shared invoice view |

---

## Roles & redirects

| Role | Default home after login |
|------|--------------------------|
| `USER` | `/dashboard` |
| `SUPPORT` | `/admin` |
| `SUPER_ADMIN` | `/admin` |

Logged-in users can still browse the marketing home page (`/`) without being redirected.

---

## Project structure

```
invoice-frontend/
├── src/
│   ├── app/
│   │   ├── (dashboard)/     # Business app routes
│   │   ├── (marketing)/     # Public marketing pages
│   │   ├── admin/           # Admin panel
│   │   ├── auth/            # Login, register, OAuth
│   │   └── portal/          # Client-facing portal
│   ├── components/
│   │   ├── modules/         # Feature components (auth, invoices, admin…)
│   │   ├── layout/          # Navbar, sidebar, shell
│   │   └── ui/              # shadcn/ui primitives
│   ├── config/              # Routes, env, demo accounts
│   ├── hooks/               # useAuth, useDashboard, etc.
│   ├── lib/                 # API client, auth cookies, utils
│   ├── providers/           # AuthProvider, QueryProvider
│   ├── services/            # API service functions
│   ├── store/               # Zustand stores
│   └── proxy.ts             # Route protection (Next.js 16)
├── next.config.ts           # API rewrites to backend
├── .env.example
└── package.json
```

---

## NPM scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

---

## Backend coordination

Ensure backend `.env` matches frontend URL:

**Local:**

```env
CLIENT_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
```

**Production:**

```env
CLIENT_URL=https://invoice-kohl-one.vercel.app
BETTER_AUTH_URL=https://invoice-kohl-one.vercel.app
TRUST_PROXY=true
```

See the [backend README](https://github.com/muhiburmahin/Invoice-Backend) for full API and deployment docs.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login works but dashboard redirects to login | Cookie name mismatch — proxy checks both `better-auth.session_token` and `__Secure-better-auth.session_token` |
| Google OAuth `redirect_uri_mismatch` | Add **frontend** URL to Google Console, not backend |
| API calls fail in production | Set `API_URL` + `NEXT_PUBLIC_BACKEND_URL` in Vercel, redeploy |
| Demo login not showing | Set `NEXT_PUBLIC_SHOW_DEMO_LOGIN=true` in Vercel, redeploy |
| CORS errors | Backend `CLIENT_URL` must match `NEXT_PUBLIC_APP_URL` |

---

## License

Private — ISC (backend)
