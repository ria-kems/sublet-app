import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ListingForm } from "@/components/listing-form";
import { getAmenities } from "@/lib/listings";

export default async function CreateListingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect(`/signin?callbackUrl=${encodeURIComponent("/create-listing")}`);
  }

  const amenityCatalog = await getAmenities();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">List a sublet</h1>
        <p className="text-base-content/70">
          Add your place for students, interns, and traveling professionals.
        </p>
      </div>
      <ListingForm amenities={amenityCatalog} />
    </main>
  );
}
