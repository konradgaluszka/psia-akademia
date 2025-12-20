# Clerk authentication plan

## Goal
Keep the current custom email/password auth and add Google/Facebook/TikTok social login via Clerk.

## Scope
- Frontend (Next.js) integrates Clerk for social OAuth flows only.
- Backend accepts Clerk social logins and links them to local users.
- Email/password, verification, and user records remain in the local system.

## Steps
1) **Create Clerk application**
   - Sign up at https://clerk.com and create a new app.
   - Enable social providers (Google, Facebook, TikTok).
   - Configure allowed origins and redirect URLs for local dev and production.

2) **Frontend integration**
   - Check Clerk SDK is installed (npm)
   - Wrap the app in `ClerkProvider` (App Router: add to `frontend/app/layout.tsx`).
   - Keep existing custom login/signup pages.
   - Use existing social buttons that trigger Clerk OAuth (e.g., `signIn.authenticateWithRedirect`).
   - Handle OAuth callbacks (Clerk redirect URLs) and resume the flow.

3) **Environment variables**
   - Check existence of `frontend/.env`:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
     - `CLERK_SECRET_KEY=...` (server-side only)
   - Add to backend `.env`:
     - `CLERK_SECRET_KEY=...` or `CLERK_JWT_ISSUER=...` (if validating JWTs directly).

4) **Backend social auth acceptance**
   - Add an endpoint to accept Clerk OAuth tokens (e.g., `POST /auth/oauth/clerk`).
   - Validate the Clerk session/JWT and extract user email + Clerk user ID.
   - Link or create a local user record:
     - If email exists locally, attach `clerk_user_id` to that user.
     - If not, create a local user with `email_verified=True` (social providers already verified).
   - Return a local session/token if your backend uses one.

5) **User data & DB**
   - Add a nullable `clerk_user_id` to local users.
   - Keep local passwords and verification for email/password users.
   - Optionally sync profile data on login or via Clerk webhooks.

6) **Webhooks (optional)**
   - Add a `/webhooks/clerk` endpoint for user.created, user.updated, user.deleted.
   - Verify webhook signatures using Clerk’s signing secret.
   - Update local DB accordingly (e.g., profile info, email).

7) **UI cleanup**
   - Keep local signup/verify pages.
   - Use existing social login buttons powered by Clerk to login/signup.

8) **Testing**
   - Manual: sign-up/sign-in/sign-out flows.
   - Backend: verify protected route with valid/invalid tokens.
   - Webhooks (if enabled): use Clerk dashboard to send test events.

## Open questions
- Should social-login users bypass local email verification entirely? Yes
- What is the local session strategy after Clerk login (JWT, cookie, etc.)? Issue jwt
- Do we want account linking rules (email match vs. explicit consent)? Yes
