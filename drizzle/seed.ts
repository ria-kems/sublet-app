import { config } from "dotenv";
import { count, eq } from "drizzle-orm";

config({ path: ".env.local" });

import {
  amenities,
  listingAmenities,
  listingImages,
  listings,
  users,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { hashPasswordSync } from "@/lib/password";

const AMENITY_NAMES = [
  "Wi-Fi",
  "Furnished",
  "Laundry",
  "Parking",
  "A/C",
  "Kitchen",
  "Pets allowed",
] as const;

const HOST_USER_ID = "11111111-1111-4111-8111-111111111111";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD;

if (!DEMO_PASSWORD) {
  throw new Error("Set DEMO_PASSWORD in .env.local before running db:seed.");
}

const DEMO_PASSWORD_HASH = hashPasswordSync(DEMO_PASSWORD);

const SEED_USERS = [
  {
    id: HOST_USER_ID,
    name: "Alex Rivera",
    email: "alex.rivera.sublets@example.com",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: "11111111-1111-4111-8111-111111111112",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: "11111111-1111-4111-8111-111111111113",
    name: "Sam Patel",
    email: "sam.patel@example.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: "11111111-1111-4111-8111-111111111114",
    name: "Riley Chen",
    email: "riley.chen@example.com",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    passwordHash: DEMO_PASSWORD_HASH,
  },
] as const;

const HOST = SEED_USERS[0];

const SEED_LISTINGS = [
  {
    id: "22222222-2222-4222-8222-222222222221",
    title: "Sunny Studio near USC",
    description:
      "Bright studio apartment steps from campus. Fully furnished with desk, queen bed, and kitchenette. Ideal for a semester sublet.",
    propertyType: "studio" as const,
    livingConfig: "entire" as const,
    utilities: "included" as const,
    utilitiesNotes: "Water and trash included; tenant pays electric.",
    priceCents: 145000,
    depositCents: 50000,
    addressStreet: "1234 Figueroa St",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90007",
    latitude: "34.022400",
    longitude: "-118.285100",
    availableStart: "2026-06-01",
    availableEnd: "2026-08-15",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "Furnished", "Kitchen"] as const,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Private Room in West LA House",
    description:
      "Quiet private room in a shared house with backyard. Street parking available. 15-minute drive to UCLA.",
    propertyType: "house" as const,
    livingConfig: "private" as const,
    utilities: "partial" as const,
    utilitiesNotes: "Split utilities with two roommates (~$80/mo).",
    priceCents: 110000,
    depositCents: 110000,
    addressStreet: "456 Bundy Dr",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90049",
    latitude: "34.052200",
    longitude: "-118.463700",
    availableStart: "2026-05-15",
    availableEnd: "2026-09-01",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "Laundry", "Parking"] as const,
  },
  {
    id: "22222222-2222-4222-8222-222222222223",
    title: "Downtown LA Loft Sublet",
    description:
      "Industrial-style loft with high ceilings and city views. Walking distance to metro and restaurants.",
    propertyType: "apartment" as const,
    livingConfig: "entire" as const,
    utilities: "tenant_pays" as const,
    utilitiesNotes: null,
    priceCents: 220000,
    depositCents: 220000,
    addressStreet: "789 S Spring St",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90014",
    latitude: "34.040700",
    longitude: "-118.246800",
    availableStart: "2026-07-01",
    availableEnd: "2026-12-31",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "A/C", "Kitchen", "Parking"] as const,
  },
  {
    id: "22222222-2222-4222-8222-222222222224",
    title: "Shared Space in Silver Lake",
    description:
      "Affordable shared room in a creative neighborhood. Great for interns on a budget.",
    propertyType: "apartment" as const,
    livingConfig: "shared" as const,
    utilities: "included" as const,
    utilitiesNotes: "All utilities included in rent.",
    priceCents: 85000,
    depositCents: 42500,
    addressStreet: "321 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90026",
    latitude: "34.086800",
    longitude: "-118.270200",
    availableStart: "2026-04-01",
    availableEnd: "2026-06-30",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "Furnished", "Kitchen"] as const,
  },
  {
    id: "33333333-3333-4333-8333-333333333331",
    title: "Mission District 1BR",
    description:
      "Charming one-bedroom in the heart of the Mission. Near BART and vibrant food scene.",
    propertyType: "apartment" as const,
    livingConfig: "entire" as const,
    utilities: "partial" as const,
    utilitiesNotes: "Gas and water included; tenant pays electric and internet.",
    priceCents: 280000,
    depositCents: 140000,
    addressStreet: "567 Valencia St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94110",
    latitude: "37.759900",
    longitude: "-122.414800",
    availableStart: "2026-06-15",
    availableEnd: "2026-10-15",
    imageUrl:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "Kitchen", "Laundry"] as const,
  },
  {
    id: "33333333-3333-4333-8333-333333333332",
    title: "Nob Hill Condo with Views",
    description:
      "Modern condo with bay views and in-unit laundry. Perfect for traveling professionals.",
    propertyType: "condo" as const,
    livingConfig: "entire" as const,
    utilities: "included" as const,
    utilitiesNotes: "HOA covers water and trash.",
    priceCents: 350000,
    depositCents: 350000,
    addressStreet: "890 California St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94108",
    latitude: "37.792500",
    longitude: "-122.412000",
    availableStart: "2026-08-01",
    availableEnd: "2027-01-31",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "A/C", "Laundry", "Parking"] as const,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "Private Room near Golden Gate Park",
    description:
      "Cozy private room in a Victorian flat. Pet-friendly household with friendly cat.",
    propertyType: "house" as const,
    livingConfig: "private" as const,
    utilities: "partial" as const,
    utilitiesNotes: "Utilities split three ways.",
    priceCents: 165000,
    depositCents: 82500,
    addressStreet: "234 Irving St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94122",
    latitude: "37.763100",
    longitude: "-122.463600",
    availableStart: "2026-05-01",
    availableEnd: "2026-08-31",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "Pets allowed", "Kitchen"] as const,
  },
  {
    id: "33333333-3333-4333-8333-333333333334",
    title: "SOMA Studio for Summer Interns",
    description:
      "Compact studio near tech offices. Furnished with standing desk and fast Wi-Fi.",
    propertyType: "studio" as const,
    livingConfig: "entire" as const,
    utilities: "tenant_pays" as const,
    utilitiesNotes: "Estimate ~$100/mo for utilities.",
    priceCents: 195000,
    depositCents: 97500,
    addressStreet: "456 Folsom St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    latitude: "37.789700",
    longitude: "-122.397200",
    availableStart: "2026-06-01",
    availableEnd: "2026-09-30",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    amenityNames: ["Wi-Fi", "Furnished", "A/C"] as const,
  },
] as const;

async function seedAmenities() {
  await db
    .insert(amenities)
    .values(AMENITY_NAMES.map((name) => ({ name })))
    .onConflictDoNothing({ target: amenities.name });

  const [{ value: amenityCount }] = await db
    .select({ value: count() })
    .from(amenities);

  console.log(`Amenity table has ${amenityCount} rows.`);

  if (amenityCount !== AMENITY_NAMES.length) {
    throw new Error(
      `Expected ${AMENITY_NAMES.length} amenities, found ${amenityCount}`,
    );
  }
}

async function seedUsers() {
  for (const user of SEED_USERS) {
    await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: user.name,
          image: user.image,
          passwordHash: user.passwordHash,
        },
      });
  }

  const [host] = await db
    .select()
    .from(users)
    .where(eq(users.email, HOST.email))
    .limit(1);

  if (!host) {
    throw new Error("Failed to seed host user.");
  }

  console.log(
    `Seeded ${SEED_USERS.length} users with hashed passwords. Host: ${host.email}`,
  );
  return host;
}

async function seedListings(hostId: string) {
  const amenityRows = await db.select().from(amenities);
  const amenityByName = new Map(amenityRows.map((row) => [row.name, row.id]));

  for (const listing of SEED_LISTINGS) {
    await db
      .insert(listings)
      .values({
        id: listing.id,
        userId: hostId,
        title: listing.title,
        description: listing.description,
        propertyType: listing.propertyType,
        livingConfig: listing.livingConfig,
        utilities: listing.utilities,
        utilitiesNotes: listing.utilitiesNotes,
        status: "active",
        priceCents: listing.priceCents,
        depositCents: listing.depositCents,
        addressStreet: listing.addressStreet,
        city: listing.city,
        state: listing.state,
        postalCode: listing.postalCode,
        latitude: listing.latitude,
        longitude: listing.longitude,
        availableStart: listing.availableStart,
        availableEnd: listing.availableEnd,
      })
      .onConflictDoNothing({ target: listings.id });

    const existingImages = await db
      .select({ value: count() })
      .from(listingImages)
      .where(eq(listingImages.listingId, listing.id));

    if (existingImages[0]?.value === 0) {
      await db.insert(listingImages).values({
        listingId: listing.id,
        blobUrl: listing.imageUrl,
        displayOrder: 0,
      });
    }

    for (const amenityName of listing.amenityNames) {
      const amenityId = amenityByName.get(amenityName);
      if (!amenityId) {
        throw new Error(`Missing amenity: ${amenityName}`);
      }

      await db
        .insert(listingAmenities)
        .values({ listingId: listing.id, amenityId })
        .onConflictDoNothing();
    }
  }

  const [{ value: listingCount }] = await db
    .select({ value: count() })
    .from(listings);

  console.log(`Listing table has ${listingCount} rows.`);

  if (listingCount < SEED_LISTINGS.length) {
    throw new Error(
      `Expected at least ${SEED_LISTINGS.length} listings, found ${listingCount}`,
    );
  }
}

async function seed() {
  await seedAmenities();
  const host = await seedUsers();
  await seedListings(host.id);
  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
