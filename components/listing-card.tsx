import Image from "next/image";
import Link from "next/link";

import { formatDateRange } from "@/lib/listings";
import { formatPrice } from "@/lib/money";
import type { ListingSearchResult } from "@/lib/listings";

type ListingCardProps = {
  listing: ListingSearchResult;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="card card-border bg-base-100 shadow-sm transition hover:shadow-md"
    >
      <figure className="relative aspect-[4/3] bg-base-200">
        {listing.heroImageUrl ? (
          <Image
            src={listing.heroImageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base-content/50">
            No photo
          </div>
        )}
      </figure>
      <div className="card-body gap-3">
        <div>
          <h2 className="card-title line-clamp-2 text-lg">{listing.title}</h2>
          <p className="text-sm text-base-content/70">
            {listing.city}, {listing.state}
          </p>
        </div>
        <p className="text-sm text-base-content/70">
          {formatDateRange(listing.availableStart, listing.availableEnd)}
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold">
            {formatPrice(listing.priceCents)}
            <span className="text-sm font-normal text-base-content/70">
              /mo
            </span>
          </p>
          <div className="avatar">
            <div className="w-9 rounded-full ring ring-base-300 ring-offset-2 ring-offset-base-100">
              {listing.hostImage ? (
                <Image
                  src={listing.hostImage}
                  alt={listing.hostName ?? "Host"}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center bg-base-300 text-xs">
                  ?
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
