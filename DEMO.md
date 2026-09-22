# Demo notes

Prototype for the individual assignment in `asst.md`: a reviewer can browse seeded sublets unsigned-in, then list a place after signing in with a demo account.

## What to show

1. Landing page CTAs: Search Sublets and List a Sublet.
2. Signed-out `/search` with filters (city, postal code, dates, price, property type, living configuration). About eight seeded listings should appear before anyone signs in.
3. A listing detail page: photos, description, amenities, utilities, neighborhood circle (not a door pin), mailto host contact. Street address is stored but not shown.
4. Anonymous visit to `/create-listing` redirects to `/signin` and returns to the form after login.
5. Submit a listing (photos optional). Redirect to `/listings/[id]` owned by the signed-in user.

If Mapbox tokens are set, the new listing shows a neighborhood circle when geocoding succeeds. If geocoding fails, the listing still saves and the map is omitted.

## Demo users

Passwords are stored in Neon as bcrypt hashes, not plaintext. All four accounts share `DEMO_PASSWORD` from `.env.local`:

| Name | Email |
| --- | --- |
| Alex Rivera | alex.rivera.sublets@example.com |
| Jordan Lee | jordan.lee@example.com |
| Sam Patel | sam.patel@example.com |
| Riley Chen | riley.chen@example.com |

Alex owns the eight seeded listings. Use any of the other three to create a new listing during the demo.

## Verify seed data

```bash
npm run db:push
npm run db:seed
npm run db:ping
```

Expected: amenities = 7, users ≥ 4, hashed passwords ≥ 4, active listings ≥ 8.

## Environment

Copy `.env.example` to `.env.local` (and set the same keys on Vercel).

| Variable | Where it comes from |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `http://localhost:3000` locally, the Vercel origin in production |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store on the project |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token (map tiles) |
| `MAPBOX_GEOCODING_TOKEN` | Mapbox secret token (server geocoding) |
| `DEMO_PASSWORD` | Shared password for seeded demo users (`db:seed`) |

## Deploy

```bash
npx vercel --prod
```
