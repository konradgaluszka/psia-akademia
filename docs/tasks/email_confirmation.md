# Email confirmation flow integration (signup)

## Goal
Add email verification to the existing signup so new users receive a verification link and can confirm their email, updating `email_verified` in the DB.

## Current state
- Backend signup (`POST /auth/signup`) creates a user with `email_verified = False` and generates a `hash` (random token) but does not send email or expose verification.
- Frontend signup page posts to `/auth/signup` and shows success/failure messaging only.
- Database: `users` table has `id`, `email`, `password`, `hash`, `email_verified`, `created_at`.

## Plan
1) **Token strategy**
   - Reuse the `hash` column as the verification token (regenerate it on signup).
   - Add expiry to tokens via a column (e.g., `email_verification_expires_at TIMESTAMPTZ`) or enforce TTL in code (e.g., 24h based on `created_at`).
2) **Email delivery**
   - Add SMTP/env config: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`.
   - Implement a mail helper (console fallback for dev) to send the confirmation email with a link containing the token. For local dev, use `http://localhost:8000/verify?token=<token>` as the link target.
3) **Verification endpoint**
   - New route `POST /auth/verify` (or `GET`) that accepts `{ token }`.
   - Validate token: find user by `hash`, check expiry/TTL, ensure not already verified.
   - On success: set `email_verified = True`, clear/rotate `hash`, persist.
   - On failure: return 400/404/410 with clear errors (invalid/expired/already verified).
4) **Signup flow change**
   - After creating user, enqueue/send the email via `BackgroundTasks` so the response isn’t blocked.
   - Response can include a generic success message (no token leakage).
5) **Frontend**
   - Add `/verify` page to read `token` from query and call backend verify endpoint; show success/error.
   - Update signup success copy to tell users to check email; optionally link to “Resend verification” (future).
6) **Testing**
   - Backend tests: token generation, conflict, verify success, expired/invalid token, already verified.
   - Frontend: basic verify page rendering and success/error states (mock fetch).

## Open questions
- Token expiry duration? (default 24h?) - 24h
- Should verify be `GET` or `POST`? - get
- Do we rotate `hash` after verification? - yes
- Resend verification endpoint needed now or later? - later 
