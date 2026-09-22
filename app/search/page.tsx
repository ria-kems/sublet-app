import { FilterBar } from "@/components/filter-bar";
import { ListingCard } from "@/components/listing-card";
import { parseSearchFilters, searchListings } from "@/lib/listings";

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const filters = parseSearchFilters(params);
  const listings = await searchListings(filters);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Search sublets</h1>
        <p className="text-base-content/70">
          Filter by location, dates, price, and property details.
        </p>
      </div>

      <FilterBar filters={filters} />

      {listings.length === 0 ? (
        <div className="alert alert-info">
          <span>No listings match your filters. Try adjusting your search.</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-base-content/70">
            {listings.length} listing{listings.length === 1 ? "" : "s"} found
          </p>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
