# Sublet Marketplace

Browse short-term sublets without an account. Listing a place requires sign-in with a seeded demo user.

## Demo path

1. Open `/` and choose **Search Sublets**.
2. Filter the seeded listings on `/search` (city, dates, price, property type, living configuration).
3. Open a listing to see photos, amenities, utilities, neighborhood map, and a mailto contact.
4. Choose **List a Sublet**. If you are signed out, you land on `/signin` and return to the form after login.
5. Submit the form. The listing is saved as `active`, images go to Vercel Blob, and the address is geocoded for the map.

See [DEMO.md](DEMO.md) for assignment notes and full account list.

## Local setup

```bash
cp .env.example .env.local
# Fill DATABASE_URL, AUTH_SECRET, DEMO_PASSWORD, Blob, and Mapbox tokens
npm install
npm run db:push
npm run db:seed
npm run db:ping
npm run dev
```

`npm run db:ping` should report 7 amenities, at least 4 users with hashed passwords, and at least 8 active listings.
