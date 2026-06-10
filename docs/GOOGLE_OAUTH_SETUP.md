# Google OAuth setup (Invoice)

## What `state_mismatch` means

Google login returns to your app with a `state` token. Better Auth stores that token in a **cookie** when you click "Continue with Google". On callback it checks cookie === URL state.

If the cookie was never set (or is on a different port/domain), you see:

`http://localhost:5000/api/auth/error?error=state_mismatch`

**Common causes in this project:**

1. OAuth started on `:5000` but cookies/session expected on `:3000` (or the reverse)
2. Google redirect URI does not match `BETTER_AUTH_URL`
3. Stale `better-auth.state` cookies — clear site data for localhost and retry

## 1. Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Open your **OAuth 2.0 Client ID** (Web application)
3. **OAuth consent screen** → set app name to **Invoice** (not an old project name like "Blog-app")
4. **Authorized JavaScript origins:**
   - `http://localhost:3000`
5. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`

Production: use your real frontend domain for both.

## 2. Backend `invoice-backend/.env`

```env
CLIENT_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=....
```

Restart the API after changes.

## 3. Frontend flow (development)

1. User clicks **Continue with Google** on `/auth/login`
2. Browser → `http://localhost:3000/api/v1/auth/google?redirect=...` (Next.js proxy → API)
3. API sets `better-auth.state` cookie and redirects to Google
4. Google → `http://localhost:3000/api/auth/callback/google` (proxied → Better Auth)
5. Redirect → `/auth/callback` → dashboard

## 4. Verify

- `GET http://localhost:5000/api/v1/auth/config` → `"google": true`
- Login page shows Google button
- After clicking Google, DevTools → Application → Cookies → `localhost` → `better-auth.state` should exist **before** you leave for Google

## 5. Quick fix checklist

1. Clear cookies for `localhost` (both :3000 and :5000)
2. Confirm `.env` values above
3. Add `http://localhost:3000/api/auth/callback/google` in Google Console
4. Restart backend **and** frontend (`npm run dev`)
5. Try Google login again

For mentor review without OAuth, use **Demo accounts** on the login page (email/password).
