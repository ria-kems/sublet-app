import { and, asc, eq, gte, ilike, lte } from "drizzle-orm";

import {
  amenities,
  listingAmenities,
  listingImages,
  listings,
  livingConfigEnum,
  propertyTypeEnum,
  users,
} from "@/drizzle/schema";
import { parseDollarInput } from "@/lib/money";
import { db } from "@/lib/db";

export type SearchFilters = {
  city?: string;
  postalCode?: string;
  start?: string;
  end?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType?: string;
  livingConfig?: string;
};

export type ListingSearchResult = {
  id: string;
  title: string;
  city: string;
  state: string;
  availableStart: string;
  availableEnd: string;
  priceCents: number;
  heroImageUrl: string | null;
  hostName: string | null;
  hostImage: string | null;
};

export type ListingDetail = {
  id: string;
  title: string;
  description: string;
  propertyType: (typeof propertyTypeEnum.enumValues)[number];
  livingConfig: (typeof livingConfigEnum.enumValues)[number];
  utilities: string;
  utilitiesNotes: string | null;
  priceCents: number;
  depositCents: number;
  city: string;
  state: string;
  postalCode: string;
  latitude: string | null;
  longitude: string | null;
  availableStart: string;
  availableEnd: string;
  images: { id: string; blobUrl: string; displayOrder: number }[];
  amenityNames: string[];
  host: {
    name: string | null;
    image: string | null;
    email: string;
  };
};

function isPropertyType(
  value: string | undefined,
): value is (typeof propertyTypeEnum.enumValues)[number] {
  return (
    value !== undefined &&
    (propertyTypeEnum.enumValues as readonly string[]).includes(value)
  );
}

function isLivingConfig(
  value: string | undefined,
): value is (typeof livingConfigEnum.enumValues)[number] {
  return (
    value !== undefined &&
    (livingConfigEnum.enumValues as readonly string[]).includes(value)
  );
}

function buildSearchConditions(filters: SearchFilters) {
  const conditions = [eq(listings.status, "active")];

  if (filters.city?.trim()) {
    conditions.push(ilike(listings.city, `%${filters.city.trim()}%`));
  }

  if (filters.postalCode?.trim()) {
    conditions.push(eq(listings.postalCode, filters.postalCode.trim()));
  }

  if (filters.start?.trim()) {
    conditions.push(gte(listings.availableEnd, filters.start.trim()));
  }

  if (filters.end?.trim()) {
    conditions.push(lte(listings.availableStart, filters.end.trim()));
  }

  const minPriceCents = parseDollarInput(filters.minPrice);
  if (minPriceCents !== undefined) {
    conditions.push(gte(listings.priceCents, minPriceCents));
  }

  const maxPriceCents = parseDollarInput(filters.maxPrice);
  if (maxPriceCents !== undefined) {
    conditions.push(lte(listings.priceCents, maxPriceCents));
  }

  if (isPropertyType(filters.propertyType)) {
    conditions.push(eq(listings.propertyType, filters.propertyType));
  }

  if (isLivingConfig(filters.livingConfig)) {
    conditions.push(eq(listings.livingConfig, filters.livingConfig));
  }

  return conditions;
}

export async function searchListings(
  filters: SearchFilters,
): Promise<ListingSearchResult[]> {
  const heroImage = db
    .select({
      listingId: listingImages.listingId,
      blobUrl: listingImages.blobUrl,
    })
    .from(listingImages)
    .where(eq(listingImages.displayOrder, 0))
    .as("hero_image");

  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      city: listings.city,
      state: listings.state,
      availableStart: listings.availableStart,
      availableEnd: listings.availableEnd,
      priceCents: listings.priceCents,
      heroImageUrl: heroImage.blobUrl,
      hostName: users.name,
      hostImage: users.image,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .leftJoin(heroImage, eq(listings.id, heroImage.listingId))
    .where(and(...buildSearchConditions(filters)))
    .orderBy(asc(listings.priceCents));

  return rows;
}

export async function getListingById(
  id: string,
): Promise<ListingDetail | null> {
  const [listing] = await db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      propertyType: listings.propertyType,
      livingConfig: listings.livingConfig,
      utilities: listings.utilities,
      utilitiesNotes: listings.utilitiesNotes,
      priceCents: listings.priceCents,
      depositCents: listings.depositCents,
      city: listings.city,
      state: listings.state,
      postalCode: listings.postalCode,
      latitude: listings.latitude,
      longitude: listings.longitude,
      availableStart: listings.availableStart,
      availableEnd: listings.availableEnd,
      status: listings.status,
      hostName: users.name,
      hostImage: users.image,
      hostEmail: users.email,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .where(eq(listings.id, id))
    .limit(1);

  if (!listing || listing.status !== "active") {
    return null;
  }

  const images = await db
    .select({
      id: listingImages.id,
      blobUrl: listingImages.blobUrl,
      displayOrder: listingImages.displayOrder,
    })
    .from(listingImages)
    .where(eq(listingImages.listingId, id))
    .orderBy(asc(listingImages.displayOrder));

  const amenityRows = await db
    .select({ name: amenities.name })
    .from(listingAmenities)
    .innerJoin(amenities, eq(listingAmenities.amenityId, amenities.id))
    .where(eq(listingAmenities.listingId, id))
    .orderBy(asc(amenities.name));

  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    propertyType: listing.propertyType,
    livingConfig: listing.livingConfig,
    utilities: listing.utilities,
    utilitiesNotes: listing.utilitiesNotes,
    priceCents: listing.priceCents,
    depositCents: listing.depositCents,
    city: listing.city,
    state: listing.state,
    postalCode: listing.postalCode,
    latitude: listing.latitude,
    longitude: listing.longitude,
    availableStart: listing.availableStart,
    availableEnd: listing.availableEnd,
    images,
    amenityNames: amenityRows.map((row) => row.name),
    host: {
      name: listing.hostName,
      image: listing.hostImage,
      email: listing.hostEmail,
    },
  };
}

export function formatPropertyType(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatLivingConfig(value: string): string {
  const labels: Record<string, string> = {
    entire: "Entire place",
    private: "Private room",
    shared: "Shared space",
  };
  return labels[value] ?? value;
}

export function formatUtilities(value: string): string {
  const labels: Record<string, string> = {
    included: "Included",
    partial: "Partial",
    tenant_pays: "Tenant pays",
  };
  return labels[value] ?? value;
}

export function formatDateRange(start: string, end: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
}

export function parseSearchFilters(
  searchParams: Record<string, string | string[] | undefined>,
): SearchFilters {
  const get = (key: string) => {
    const value = searchParams[key];
    return typeof value === "string" ? value : undefined;
  };

  return {
    city: get("city"),
    postalCode: get("postalCode"),
    start: get("start"),
    end: get("end"),
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    propertyType: get("propertyType"),
    livingConfig: get("livingConfig"),
  };
}
