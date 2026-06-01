# Google OAuth setup (Invoice)

## 1. Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create **OAuth 2.0 Client ID** (Web application)
3. **Authorized JavaScript origins:**
   - `http://localhost:3000` (frontend)
   - `http://localhost:5000` (API — Better Auth)
4. **Authorized redirect URIs:**
   - `http://localhost:5000/api/auth/callback/google`

Production: replace with your real API domain.

## 2. Backend `invoice-backend/.env`

```env
CLIENT_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=....
```

Restart API after changes.

## 3. Frontend flow

1. User clicks **Continue with Google** on `/auth/login`
2. Browser → `/api/v1/auth/social/google?redirect=http://localhost:3000/auth/callback`
3. Google OAuth → API sets session cookie (via Next.js proxy, same origin)
4. Redirect → `/auth/callback` → refresh session → dashboard `/`

## 4. Verify

- `GET http://localhost:5000/api/v1/auth/config` → `"google": true`
- Login page shows Google button
