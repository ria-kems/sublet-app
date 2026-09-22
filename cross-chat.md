# Cross-Chat Summary

## Project

Individual prototype for a **Sublet Marketplace** (assignment in `asst.md`). Users search sublets without login or list a place after Google sign-in. Stack: Next.js, Neon Postgres, Vercel Blob, Mapbox, DaisyUI.

## PRD review and decisions

Reviewed `prd.md` against `asst.md`. PRD was sufficient for an MVP prototype with these gaps resolved:

| Topic | Decision |
| --- | --- |
| **Contact** | Lister email from Google OAuth (`mailto:`). No phone, no in-app messaging. |
| **Amenities / utilities** | Added `utilities`, `utilities_notes`, `amenities`, `listing_amenities` to schema. |
| **Property types** | Split into two enums: `property_type` (`apartment`, `studio`, `house`, `condo`) and `living_config` (`entire`, `private`, `shared`). |
| **Map** | Mapbox via `react-map-gl`; geocode on create; neighborhood circle on detail (not exact door pin). |
| **Prototype scope** | Demo path only: landing, search, detail, gated create, ~8 seed listings. Status enum kept but prototype only writes `active`. Edit, delete, chat, payments out. |
| **UI** | DaisyUI (not Radix). DaisyUI is a Tailwind plugin; Tailwind still required underneath. |

`prd.md` was updated with all of the above.

## Planning artifacts

- **`erd.md`** — Master engineering plan: locked stack, build order, app layout, env vars, data model (Mermaid ERD), read/auth/create paths, seed spec, done criteria.
- **Implementation split** — Five phases for extensibility:
  1. Foundation
  2. Read path (seed listings, landing, search, detail)
  3. Auth (Google gate for create only)
  4. Write path (create form, Blob upload, geocoding)
  5. Ship (Vercel deploy)

## Foundation layer (implemented)

Built per the foundation plan. Repo now has a runnable Next.js 16 shell.

**In place:**
- Next.js App Router + TypeScript + Tailwind v4 + DaisyUI (`data-theme="light"`)
- Stub page at `/` ("Foundation ready" + DaisyUI button)
- Full Drizzle schema in `drizzle/schema.ts` matching PRD (all tables, enums, indexes, cascade FKs)
- Migration generated: `drizzle/migrations/0000_shallow_the_enforcers.sql`
- `lib/db.ts` — Neon pooled client
- `drizzle/seed.ts` — 7 amenities (idempotent via `onConflictDoNothing`)
- `scripts/db-ping.ts` — verifies amenity count = 7
- `.env.example` with all planned env vars
- `package.json` scripts: `db:generate`, `db:migrate`, `db:push`, `db:seed`, `db:ping`
- Later-phase deps pre-installed: Auth.js, Zod, Vercel Blob, react-map-gl, mapbox-gl

**Not in foundation (later phases):**
- Auth config / Google OAuth routes
- Landing, search, detail, create UI
- Host user + 8 listing seed
- Blob upload route, Mapbox components
- Vercel deploy

**To finish foundation DB setup locally:**
```bash
cp .env.example .env.local   # set Neon pooled DATABASE_URL
npm run db:push
npm run db:seed
npm run db:ping
```

`npm run build` passes with DaisyUI. Migration push/seed were not run in-session (no `DATABASE_URL` configured).

## Read path (implemented)

Seeded host + 8 listings; landing, `/search`, `/listings/[id]` work without login.

## Auth, write path, and ship (implemented)

Phases 3–5 shipped together, then auth was switched off Google OAuth:

- Auth.js credentials + JWT; `/create-listing` is the only gated page
- Four seeded Neon users with bcrypt password hashes
- Create form, Vercel Blob client uploads, Mapbox geocoding, batched insert
- README + DEMO.md for reviewers
