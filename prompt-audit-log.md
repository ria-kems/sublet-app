# AI Prompt Audit Log

**Assignment:** Individual prototype (process documentation)  
**Product:** Sublet marketplace (SubletMatch)  
**Tool:** Cursor Agent (plan + implement)  
**Date:** 21 September 2026  
**Stack:** Next.js 16 App Router, Neon Postgres, Drizzle, DaisyUI, Mapbox, Vercel Blob, Auth.js

This log is the process documentation requested by the assignment: prompts used, what they produced, and how the prototype was iterated.

---

## How I used AI

I did not generate the app from a single “build this website” prompt. Work was split into short Cursor chats:

1. Review the PRD against the assignment and lock product decisions.
2. Write an engineering plan (`erd.md`).
3. Implement a foundation layer (schema + app shell).
4. Implement the public read path (seed, landing, search, detail).
5. Connect Neon so seeded listings actually load.
6. (Started) Auth + create listing + ship, as one remaining step.

Cursor Plan mode was used for implementation phases. After a plan was approved, Cursor injected an “Implement the plan…” prompt. Those are marked **(plan execute)** below so it is clear which wording I wrote vs which the tool generated.

Secrets (database URL, API keys) are redacted from this log.

---

## Prompt log

### Phase 0 — PRD review and decisions

| Time | Prompt (verbatim, abbreviated where long) | Result |
| --- | --- | --- |
| 9:57 PM | `Do you have sufficient context about this product design doc? @prd.md This is based on the assignment @asst.md that we are trying to complete. BE CONCISE` | AI said yes for an MVP prototype, no for a faithful full build. Flagged five gaps: contact channel, amenities/utilities missing from schema, property-type enum mismatch, no map provider, prototype scope not cut. |
| 9:59 PM | `1 will this not be picked up from the oauth?` / `2 add that to the database schema` / `3 we need two separate enums 1 for property_type and one for living config (entire, private, shared)` / `4 suggest a map provider` / `5 clarify this` | Locked decisions: lister email from Google OAuth (`mailto:`); add utilities + amenities tables; split `property_type` vs `living_config`; Mapbox with neighborhood circle; demo path only (no edit/delete/chat/payments). |
| 10:00 PM | `edits I need, rest can skip` / `update prd as necessary` | `prd.md` updated with those decisions. |
| 10:00 PM | `okay mode changed` | Switched from read-only planning to write mode so the PRD edits could be applied. |

### Phase 1 — Engineering plan and foundation

| Time | Prompt | Result |
| --- | --- | --- |
| 10:03 PM | `create an erd for this prd in erd.md` | First draft of the data model. |
| 10:03 PM | `create an engineering implementation plan in erd.md` | Expanded `erd.md` into the master plan: locked stack, build order, app layout, env vars, ERD, read/auth/create paths, seed spec, done criteria. |
| 10:04 PM | `update ui choice to use daisyui instead of tailwaind` | UI locked to DaisyUI (Tailwind still underneath). Corrected a typo in the request (`tailwaind` → Tailwind). |
| 10:07 PM | `Based on these files, Should we split implementation into separate plans? We want the implementation to be easily extensible. OUTPUT VERY CONCISELY` | Split into five phases: Foundation → Read path → Auth → Write path → Ship. |
| 10:08 PM | `BUILD the plan for the foundation layer. BE CONCISE where possible.` | Foundation plan + todos. |
| 10:09 PM | **(plan execute)** `Foundation Layer` / `Implement the plan as specified… Don't stop until you have completed all the to-dos.` | Scaffolded Next.js 16 + Tailwind v4 + DaisyUI; Drizzle schema + first migration; `lib/db.ts` Neon client; amenity seed; `scripts/db-ping.ts`; `.env.example`; db npm scripts. |
| 10:14 PM | `Summarize this conversation into @cross-chat.md` | Wrote `cross-chat.md` so later chats could continue without rereading the whole thread. |

### Phase 2 — Read path (browse without login)

| Time | Prompt | Result |
| --- | --- | --- |
| 10:16 PM | `Help me build a plan for the "Read path — seed, landing, search, detail" per @erd.md @prd.md @cross-chat.md. BE CONCISE where possible. REMEMBER to add Todos` | Read-path plan: 1 host + 8 listings, header, landing, `/search` filters, `/listings/[id]` detail + neighborhood map. |
| 10:18 PM | **(plan execute)** `Read path — seed, landing, search, detail` / `Implement the plan as specified…` | Implemented seed expansion, listing queries, landing, search grid, detail page, DaisyUI header/cards/filters, Mapbox neighborhood circle. `npm run build` passed. Search/detail could not load data yet because Neon was not connected. |
| 10:29 PM | `whats the holdup man` | Diagnosed the blocker: code was done; `.env.local` still had a placeholder `DATABASE_URL`, so queries failed with `fetch failed`. |

### Phase 3 — Neon setup

| Time | Prompt | Result |
| --- | --- | --- |
| 10:31 PM | `i need help setting up neon` | Step-by-step: create Neon project, copy **pooled** connection string (`-pooler` in hostname), put it in `.env.local`, then `db:push` / `db:seed` / `db:ping`. |
| 10:40 PM | *(pasted Neon pooled connection string)* | Saved URL to `.env.local` (gitignored). Schema pushed. Seed succeeded: 7 amenities, 1 host, 8 active listings. Ping: `Database connected. Amenities: 7, Users: 1, Active listings: 8`. |

### Phase 4 — Auth, create, ship (started in a parallel chat)

| Time | Prompt | Result |
| --- | --- | --- |
| 10:43 PM | `3 Auth — Google gate for create only` / `4 Write path — create form, Blob upload, geocoding` / `5 Ship — Vercel, seed verify, demo notes` / `we're doing all of this as one step` | Combined remaining phases into one Cursor session. Exploration of existing schema and PRD started. This log was generated before that session finished. |

---

## Iteration summary

The assignment asks how the prototype was iterated. The pattern was:

1. **Gap-find the PRD before writing code.** First prompt was only “is this enough?” not “build the app.”
2. **Human decisions, then doc updates.** Numbered replies (OAuth email, two enums, Mapbox, demo-only scope) were written back into `prd.md` so later prompts could cite a single source of truth.
3. **Plan file as the contract.** `erd.md` became the engineering spec. Implementation chats were told not to edit the plan file.
4. **Vertical slices, not a monolith.** Foundation (schema + shell) first, then public browse, then database, then gated create. That kept each prompt small enough to review.
5. **Unblock with a concrete artifact.** When search crashed, the next prompt was not “fix the app” — it was “help me set up Neon,” then the actual connection string.
6. **Cross-chat handoff.** `cross-chat.md` was generated on purpose so a new Cursor chat could pick up the next phase.

What I steered vs what the model guessed:

- I required DaisyUI, two enums, OAuth email as contact, and Mapbox.
- The model suggested cutting edit/delete/chat/payments for prototype scope; I accepted that.
- Cursor Plan mode generated the long “implement the plan” prompts after I approved each plan.

---

## Code and files produced with AI

Planning / process

- `asst.md` — assignment (source, not generated)
- `prd.md` — product spec, edited after the five decisions
- `erd.md` — engineering plan + ERD
- `cross-chat.md` — session handoff notes
- `prompt-audit-log.md` — this file

Foundation

- `drizzle/schema.ts` — users, accounts, listings, images, amenities
- `drizzle/migrations/0000_shallow_the_enforcers.sql`
- `lib/db.ts` — Neon serverless + Drizzle
- `scripts/db-ping.ts`
- `.env.example`

Read path

- `drizzle/seed.ts` — 7 amenities, 1 host, 8 listings
- `lib/listings.ts`, `lib/money.ts`
- `app/page.tsx` — landing CTAs
- `app/search/page.tsx` — filters + card grid
- `app/listings/[id]/page.tsx` — detail, mailto, map
- `components/header.tsx`, `filter-bar.tsx`, `listing-card.tsx`, `neighborhood-map.tsx`

Not done by AI (manual)

- Neon project creation and password
- Google OAuth client, Mapbox token, Vercel Blob token (needed for create/ship)
- Git commits / push to GitHub

---

## Verification

```bash
npm run db:push    # apply schema to Neon
npm run db:seed    # 7 amenities, 1 host, 8 listings
npm run db:ping    # Database connected. Amenities: 7, Users: 1, Active listings: 8
npm run build      # TypeScript / Next.js build
npm run dev        # local demo; /search shows seeded listings
```

---

## Note on secrets

A Neon connection string was pasted into Cursor during setup. It is not reproduced here. `.env.local` is gitignored. If this log is shared beyond the course, rotate the Neon role password.
