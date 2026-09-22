import { config } from "dotenv";
import { count, eq, isNotNull } from "drizzle-orm";

config({ path: ".env.local" });

import { amenities, listings, users } from "@/drizzle/schema";
import { db } from "@/lib/db";

async function ping() {
  const [{ value: amenityCount }] = await db
    .select({ value: count() })
    .from(amenities);

  const [{ value: userCount }] = await db.select({ value: count() }).from(users);

  const [{ value: listingCount }] = await db
    .select({ value: count() })
    .from(listings)
    .where(eq(listings.status, "active"));

  const [{ value: hashedUserCount }] = await db
    .select({ value: count() })
    .from(users)
    .where(isNotNull(users.passwordHash));

  console.log(
    `Database connected. Amenities: ${amenityCount}, Users: ${userCount}, Hashed passwords: ${hashedUserCount}, Active listings: ${listingCount}`,
  );

  if (amenityCount !== 7) {
    throw new Error(`Expected 7 amenities, found ${amenityCount}`);
  }

  if (userCount < 4) {
    throw new Error(`Expected at least 4 users, found ${userCount}`);
  }

  if (hashedUserCount < 4) {
    throw new Error(
      `Expected at least 4 users with hashed passwords, found ${hashedUserCount}`,
    );
  }

  if (listingCount < 8) {
    throw new Error(`Expected at least 8 active listings, found ${listingCount}`);
  }
}

ping()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Ping failed:", error);
    process.exit(1);
  });
