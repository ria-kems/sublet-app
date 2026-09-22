import { z } from "zod";

import {
  livingConfigEnum,
  propertyTypeEnum,
  utilityCoverageEnum,
} from "@/drizzle/schema";

const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date");

function parseDollar(value: unknown, { required }: { required: boolean }) {
  if (value === null || value === undefined || value === "") {
    return required ? Number.NaN : 0;
  }

  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  return parsed;
}

export const listingFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(150),
    description: z.string().trim().min(1, "Description is required"),
    propertyType: z.enum(propertyTypeEnum.enumValues),
    livingConfig: z.enum(livingConfigEnum.enumValues),
    price: z
      .unknown()
      .transform((value) => parseDollar(value, { required: true }))
      .pipe(z.number().positive("Monthly price must be greater than 0")),
    deposit: z
      .unknown()
      .transform((value) => parseDollar(value, { required: false }))
      .pipe(z.number().min(0, "Deposit cannot be negative")),
    addressStreet: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined),
    city: z.string().trim().min(1, "City is required").max(100),
    state: z.string().trim().min(1, "State is required").max(50),
    postalCode: z.string().trim().min(1, "Postal code is required").max(20),
    utilities: z.enum(utilityCoverageEnum.enumValues).default("tenant_pays"),
    utilitiesNotes: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined),
    amenityIds: z.array(z.string().uuid()).default([]),
    imageUrls: z.array(z.string().url()).default([]),
    availableStart: dateString,
    availableEnd: dateString,
  })
  .refine((value) => value.availableEnd >= value.availableStart, {
    message: "End date must be on or after the start date",
    path: ["availableEnd"],
  });

export type ListingFormValues = z.infer<typeof listingFormSchema>;

export function parseListingForm(formData: FormData) {
  return listingFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    propertyType: formData.get("propertyType"),
    livingConfig: formData.get("livingConfig"),
    price: formData.get("price"),
    deposit: formData.get("deposit"),
    addressStreet: formData.get("addressStreet") ?? "",
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    utilities: formData.get("utilities") || "tenant_pays",
    utilitiesNotes: formData.get("utilitiesNotes") ?? "",
    amenityIds: formData.getAll("amenityIds").filter(Boolean),
    imageUrls: formData.getAll("imageUrls").filter(Boolean),
    availableStart: formData.get("availableStart"),
    availableEnd: formData.get("availableEnd"),
  });
}
