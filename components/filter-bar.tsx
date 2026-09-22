import type { SearchFilters } from "@/lib/listings";

type FilterBarProps = {
  filters: SearchFilters;
};

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <form
      action="/search"
      method="get"
      className="card bg-base-100 border border-base-300 shadow-sm"
    >
      <div className="card-body gap-4">
        <h2 className="card-title text-lg">Filter listings</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="form-control w-full">
            <span className="label-text">City</span>
            <input
              type="text"
              name="city"
              defaultValue={filters.city ?? ""}
              placeholder="Los Angeles"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Postal code</span>
            <input
              type="text"
              name="postalCode"
              defaultValue={filters.postalCode ?? ""}
              placeholder="90007"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Available from</span>
            <input
              type="date"
              name="start"
              defaultValue={filters.start ?? ""}
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Available until</span>
            <input
              type="date"
              name="end"
              defaultValue={filters.end ?? ""}
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Min price ($/mo)</span>
            <input
              type="number"
              name="minPrice"
              min={0}
              step={1}
              defaultValue={filters.minPrice ?? ""}
              placeholder="800"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Max price ($/mo)</span>
            <input
              type="number"
              name="maxPrice"
              min={0}
              step={1}
              defaultValue={filters.maxPrice ?? ""}
              placeholder="3000"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Property type</span>
            <select
              name="propertyType"
              defaultValue={filters.propertyType ?? ""}
              className="select select-bordered w-full"
            >
              <option value="">Any</option>
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </label>

          <label className="form-control w-full">
            <span className="label-text">Living config</span>
            <select
              name="livingConfig"
              defaultValue={filters.livingConfig ?? ""}
              className="select select-bordered w-full"
            >
              <option value="">Any</option>
              <option value="entire">Entire place</option>
              <option value="private">Private room</option>
              <option value="shared">Shared space</option>
            </select>
          </label>
        </div>

        <div className="card-actions justify-end">
          <a href="/search" className="btn btn-ghost">
            Clear
          </a>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
