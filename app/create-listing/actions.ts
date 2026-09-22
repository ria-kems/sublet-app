"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { geocodeAddress } from "@/lib/geocode";
import { createListing } from "@/lib/listings";
import { dollarsToCents } from "@/lib/money";
import { parseListingForm } from "@/lib/validators";

export type CreateListingState = {
  error?: string;
};

export async function createListingAction(
  _prevState: CreateListingState,
  formData: FormData,
): Promise<CreateListingState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to create a listing." };
  }

  const parsed = parseListingForm(formData);
  if (!parsed.success) {
    return { error: z.prettifyError(parsed.error) };
  }

  const values = parsed.data;

  try {
    const coordinates = await geocodeAddress({
      street: values.addressStreet,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
    });

    const listingId = await createListing({
      userId: session.user.id,
      title: values.title,
      description: values.description,
      propertyType: values.propertyType,
      livingConfig: values.livingConfig,
      utilities: values.utilities,
      utilitiesNotes: values.utilitiesNotes,
      priceCents: dollarsToCents(values.price),
      depositCents: dollarsToCents(values.deposit),
      addressStreet: values.addressStreet,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
      availableStart: values.availableStart,
      availableEnd: values.availableEnd,
      amenityIds: values.amenityIds,
      imageUrls: values.imageUrls,
    });

    revalidatePath("/search");
    revalidatePath(`/listings/${listingId}`);
    redirect(`/listings/${listingId}`);
  } catch (error) {
    unstable_rethrow(error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not save this listing. Try again.",
    };
  }
}
