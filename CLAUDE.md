# TenderLabs — Project Rules (CLAUDE.md)

You are building TenderLabs: a B2B middleware that converts Bluebeam Revu CSV exports
into CavSoft-importable XLSX ZIPs. Monorepo: `web/` (Next.js App Router + TS + Tailwind
+ shadcn) and `engine/` (Python FastAPI). Supabase = auth + metadata DB only.

## Prime Directives
1. ZERO DATA RETENTION. Uploaded file contents and anything derived from them
   (rows, prices, item codes) must NEVER be written to disk, database, object
   storage, logs, error messages, or analytics — anywhere, ever. Only metadata
   (user id, project name, mode, row/warning counts, duration) may persist.
2. Work ONLY on the current milestone. Do not scaffold ahead. Do not refactor
   unrelated code. Stop when the milestone's Done criteria are met and wait for
   the human PROOF gate.
3. When official templates exist (Supabase SSR auth), COPY them verbatim from
   the docs provided in context. Never reconstruct library APIs from memory.

## Supabase Auth Rules (anti-hallucination)
- Use `@supabase/ssr` ONLY. The package `@supabase/auth-helpers-nextjs` is
  deprecated and BANNED. If you find yourself importing it, stop.
- Cookie handling uses EXACTLY the official `getAll()` / `setAll()` pattern in
  `utils/supabase/{client,server,middleware}.ts`. Do not invent methods like
  `get/set/remove` per-cookie; do not hand-roll cookie serialization.
- Use `supabase.auth.getClaims()` for route gating in middleware and any
  per-request auth check (it verifies the JWT locally, no network call).
  `getUser()` is allowed ONLY when a revocation-checked authoritative lookup is
  explicitly required, and must carry a code comment justifying it.
- Auth files are copied once and then FROZEN. Bug elsewhere? Fix elsewhere.

## Dev Environment Recovery (Next.js / Turbopack)
- On HTTP 431 (Request Header Fields Too Large), Turbopack panics, ghost module
  errors, or inexplicable middleware loops: the fix is
  `rm -rf .next node_modules/.cache` and restart the dev server.
- NEVER respond to these symptoms by rewriting cookie logic, trimming session
  data, changing auth code, or ejecting middleware. Cache clear first. If the
  error survives a clean cache AND a fresh browser profile, report it — do not
  self-medicate the auth layer.

## Routing & Frontend Rules
- App Router only. Route groups: `(auth)` and `(dashboard)`. One `middleware.ts`.
  No experimental flags, no client-side router libraries, no nested layouts
  beyond what the two groups require.
- Server Components by default; `"use client"` only where interaction demands.
- shadcn/ui + Tailwind tokens only. Theme: Premium Dark Industrial
  (near-black surfaces, steel greys, single industrial accent), with a
  light/dark toggle via `next-themes`. No inline hex colors in components —
  tokens in globals.css / tailwind config only.
- Keep routes minimal and boring: `/login`, `/auth/confirm`, `/dashboard`,
  `/dashboard/history`. Do not add routes not in the plan.

## Engine (FastAPI) Rules
- The transformation pipeline in `engine/app/core/` is PURE and IN-MEMORY:
  bytes/DataFrame in → bytes/DataFrame out. The strings `tempfile` and `open(`
  must never appear in `engine/app/core/`.
- Do NOT use FastAPI `UploadFile` for the transform endpoint — its
  SpooledTemporaryFile writes to disk above ~1MB. Consume `request.stream()`
  into a `BytesIO` with a hard 25MB abort-before-buffer cap.
- Responses stream the ZIP from memory (`StreamingResponse`). Attach cleanup
  and the metadata insert as a response BackgroundTask. No job queues, no
  result storage, no "download later" links.
- Bluebeam embedded XML is hex-encoded zlib. Decode/encode with `latin-1`,
  never utf-8. Never guess Bluebeam column names — code against the sample
  files in `docs/BLUEBEAM_SAMPLES/` and the column map in `docs/CAVSOFT_SPEC.md`.
- JWT verification: PyJWT against the cached Supabase JWKS; verify exp and aud;
  extract `sub` as user_id. The service-role key lives ONLY in engine env.
- Logging: structlog, metadata only. It is a bug to log any cell value, price,
  item code, or file content — including inside exception messages. 422
  diagnostics may reference COLUMN HEADERS only, never row data.
- Error taxonomy: 401 auth, 413 size, 422 parse/schema, 500 opaque.

## Testing & Proof Discipline
- engine/app/core/ ships with pytest coverage including golden-file tests
  against the sample CSVs before any HTTP endpoint is written.
- Never mark a milestone complete yourself. Present the Done criteria status
  and the exact commands for the human PROOF step, then stop.

## General Style
- TypeScript strict; zod at every user-input boundary.
- Python 3.12, type-hinted, pydantic-settings for config.
- Small commits per milestone step, imperative messages, no drive-by changes.