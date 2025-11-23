# Repository Guidelines

## Project Structure & Module Organization
- Frontend lives in `frontend/` (React/TypeScript). Organize by feature (`frontend/src/features/<feature>/components|hooks|api`) with shared primitives in `frontend/src/shared/`.
- Backend lives in `backend/` (Python). Use `backend/app/` for application code (routers, services, models), `backend/app/core/` for settings/logging, `backend/app/api/` for FastAPI/Flask routes.
- Tests mirror code: `frontend/src/**/__tests__/` or `*.test.ts[x]`; `backend/tests/` mirrors `app/` (e.g., `app/services/foo.py` → `tests/services/test_foo.py`).
- Common assets in `frontend/public/` and `assets/`; developer helpers in `scripts/`; root-level config (lint/format/type) stays visible.

## Build, Test, and Development Commands
- Prefer Makefile shims:
  - `make setup` (install Node+Python deps; use `npm ci`/`pnpm install` + `pip install -r requirements.txt` or `poetry install`).
  - `make fmt` (runs `frontend: prettier --write` + `backend: black`).
  - `make lint` (runs `frontend: eslint` + `backend: ruff mypy`).
  - `make test` (runs `npm test -- --watch=false` + `pytest --maxfail=1`).
  - `make dev` (starts `npm start`/`npm run dev` and backend server with auto-reload).
- Document required env vars in `.env.example` for both tiers; never commit `.env`.

## Coding Style & Naming Conventions
- TypeScript: 2-space indent, `prettier` enforced; components PascalCase (`UserCard.tsx`), hooks `useThing.ts`, utility modules lower-kebab filenames; avoid default exports for shared components.
- Python: 4-space indent, `black` + `ruff` + `mypy`; modules and functions snake_case; classes PascalCase; constants UPPER_SNAKE.
- Keep lines ≤ 100–120 chars; prefer explicit imports; favor composition over inheritance; add docstrings to public Python functions and components with non-trivial props.

## Testing Guidelines
- Frontend: `@testing-library/react` + `vitest`/`jest`; name files `*.test.tsx`. Prefer user-facing assertions (`getByRole`, `getByText`) and avoid snapshot overuse.
- Backend: `pytest` with `pytest-cov`; name files `test_*.py`. Use factories/fixtures under `backend/tests/fixtures/`; mock network/DB boundaries.
- Target ≥85% coverage where practical; add regression tests per bugfix; keep tests deterministic (no live network).

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`); subjects ≤72 chars.
- PRs: include scope, testing performed (`make lint`, `make test`, manual UI notes), linked issues, and screenshots for UI changes; call out migrations or env/config changes.
- Keep diffs focused and small; update `CHANGELOG.md` when versioned releases are maintained.

## Security & Configuration
- Never commit secrets. Load tokens/keys from environment (backed by `.env.example`) and prefer per-environment `.env.local` files gitignored.
- Enforce CORS and auth on backend APIs; validate inputs at the boundary; log without leaking PII. Prefer least-privilege API keys and rotate regularly.
