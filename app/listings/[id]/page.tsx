import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NeighborhoodMap } from "@/components/neighborhood-map";
import {
  formatDateRange,
  formatLivingConfig,
  formatPropertyType,
  formatUtilities,
  getListingById,
} from "@/lib/listings";
import { formatPrice } from "@/lib/money";

export default async function ListingDetailPage({
  params,
}: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const latitude = listing.latitude ? Number.parseFloat(listing.latitude) : null;
  const longitude = listing.longitude
    ? Number.parseFloat(listing.longitude)
    : null;
  const showMap =
    mapToken && latitude !== null && longitude !== null && !Number.isNaN(latitude) && !Number.isNaN(longitude);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 p-6">
      <Link href="/search" className="btn btn-ghost w-fit px-0">
        ← Back to search
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">{listing.title}</h1>
        <p className="text-base-content/70">
          {listing.city}, {listing.state} {listing.postalCode}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-outline">
            {formatPropertyType(listing.propertyType)}
          </span>
          <span className="badge badge-outline">
            {formatLivingConfig(listing.livingConfig)}
          </span>
        </div>
      </div>

      {listing.images.length > 0 ? (
        <div className="carousel carousel-center w-full gap-4 rounded-box bg-base-200 p-4">
          {listing.images.map((image) => (
            <div
              key={image.id}
              className="carousel-item relative h-72 w-full max-w-xl overflow-hidden rounded-box"
            >
              <Image
                src={image.blobUrl}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
                priority={image.displayOrder === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-box bg-base-200 text-base-content/50">
          No photos available
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">About this place</h2>
            <p className="whitespace-pre-wrap text-base-content/80">
              {listing.description}
            </p>
          </div>

          {listing.amenityNames.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-semibold">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenityNames.map((amenity) => (
                  <span key={amenity} className="badge badge-lg badge-ghost">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-2 text-xl font-semibold">Utilities</h2>
            <p>{formatUtilities(listing.utilities)}</p>
            {listing.utilitiesNotes && (
              <p className="mt-1 text-sm text-base-content/70">
                {listing.utilitiesNotes}
              </p>
            )}
          </div>

          {showMap && (
            <div>
              <h2 className="mb-3 text-xl font-semibold">Neighborhood</h2>
              <p className="mb-3 text-sm text-base-content/70">
                Approximate area only — exact address is not shown.
              </p>
              <NeighborhoodMap
                latitude={latitude}
                longitude={longitude}
                token={mapToken}
              />
            </div>
          )}
        </section>

        <aside className="card card-border bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <p className="text-3xl font-semibold">
                {formatPrice(listing.priceCents)}
                <span className="text-base font-normal text-base-content/70">
                  /mo
                </span>
              </p>
              <p className="text-sm text-base-content/70">
                Deposit: {formatPrice(listing.depositCents)}
              </p>
            </div>

            <div>
              <p className="text-sm text-base-content/70">Available</p>
              <p className="font-medium">
                {formatDateRange(
                  listing.availableStart,
                  listing.availableEnd,
                )}
              </p>
            </div>

            <div className="divider my-0" />

            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-base-300">
                  {listing.host.image ? (
                    <Image
                      src={listing.host.image}
                      alt={listing.host.name ?? "Host"}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center bg-base-300">
                      ?
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium">{listing.host.name ?? "Host"}</p>
                <p className="text-sm text-base-content/70">Verified lister</p>
              </div>
            </div>

            <a
              href={`mailto:${listing.host.email}?subject=${encodeURIComponent(`Sublet inquiry: ${listing.title}`)}`}
              className="btn btn-primary w-full"
            >
              Contact host
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
