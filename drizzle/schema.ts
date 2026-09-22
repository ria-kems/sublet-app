import {
  bigint,
  date,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const propertyTypeEnum = pgEnum("property_type_enum", [
  "apartment",
  "studio",
  "house",
  "condo",
]);

export const livingConfigEnum = pgEnum("living_config_enum", [
  "entire",
  "private",
  "shared",
]);

export const utilityCoverageEnum = pgEnum("utility_coverage_enum", [
  "included",
  "partial",
  "tenant_pays",
]);

export const listingStatusEnum = pgEnum("listing_status_enum", [
  "draft",
  "active",
  "rented",
  "archived",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: bigint("expires_at", { mode: "number" }),
    token_type: varchar("token_type", { length: 50 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    unique("accounts_provider_provider_account_id_unique").on(
      table.provider,
      table.providerAccountId,
    ),
  ],
);

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 150 }).notNull(),
    description: text("description").notNull(),
    propertyType: propertyTypeEnum("property_type")
      .notNull()
      .default("apartment"),
    livingConfig: livingConfigEnum("living_config")
      .notNull()
      .default("entire"),
    utilities: utilityCoverageEnum("utilities")
      .notNull()
      .default("tenant_pays"),
    utilitiesNotes: text("utilities_notes"),
    status: listingStatusEnum("status").notNull().default("active"),
    priceCents: integer("price_cents").notNull(),
    depositCents: integer("deposit_cents").notNull().default(0),
    addressStreet: varchar("address_street", { length: 255 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 50 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    latitude: decimal("latitude", { precision: 9, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),
    availableStart: date("available_start").notNull(),
    availableEnd: date("available_end").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_listings_city").on(table.city),
    index("idx_listings_availability").on(
      table.availableStart,
      table.availableEnd,
    ),
    index("idx_listings_price").on(table.priceCents),
    index("idx_listings_property_type").on(table.propertyType),
    index("idx_listings_living_config").on(table.livingConfig),
  ],
);

export const listingImages = pgTable(
  "listing_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    blobUrl: text("blob_url").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_listing_images_listing_id").on(table.listingId)],
);

export const amenities = pgTable("amenities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const listingAmenities = pgTable(
  "listing_amenities",
  {
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    amenityId: uuid("amenity_id")
      .notNull()
      .references(() => amenities.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.listingId, table.amenityId] }),
    index("idx_listing_amenities_amenity_id").on(table.amenityId),
  ],
);
