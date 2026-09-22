"use client";

import { upload } from "@vercel/blob/client";
import { useActionState, useState, type ChangeEvent } from "react";

import {
  createListingAction,
  type CreateListingState,
} from "@/app/create-listing/actions";
import { compressImage } from "@/lib/compress-image";

type AmenityOption = {
  id: string;
  name: string;
};

type ListingFormProps = {
  amenities: AmenityOption[];
};

const initialState: CreateListingState = {};

export function ListingForm({ amenities }: ListingFormProps) {
  const [state, formAction, pending] = useActionState(
    createListingAction,
    initialState,
  );
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) {
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const compressed = await compressImage(file);
        const blob = await upload(compressed.name, compressed, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });
        uploaded.push(blob.url);
      }
      setImageUrls((current) => [...current, ...uploaded]);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Could not upload one of the images.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5">
        {(state.error || uploadError) && (
          <div className="alert alert-error">
            <span>{state.error ?? uploadError}</span>
          </div>
        )}

        <label className="form-control w-full">
          <span className="label-text">Title</span>
          <input
            name="title"
            required
            maxLength={150}
            className="input input-bordered w-full"
            placeholder="Sunny studio near campus"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text">Description</span>
          <textarea
            name="description"
            required
            rows={5}
            className="textarea textarea-bordered w-full"
            placeholder="Tell searchers about the space, furniture, and neighborhood."
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text">Property type</span>
            <select
              name="propertyType"
              required
              defaultValue="apartment"
              className="select select-bordered w-full"
            >
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </label>

          <label className="form-control w-full">
            <span className="label-text">Living configuration</span>
            <select
              name="livingConfig"
              required
              defaultValue="entire"
              className="select select-bordered w-full"
            >
              <option value="entire">Entire place</option>
              <option value="private">Private room</option>
              <option value="shared">Shared space</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text">Monthly price ($)</span>
            <input
              name="price"
              type="number"
              required
              min={1}
              step={1}
              className="input input-bordered w-full"
              placeholder="1800"
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Deposit ($)</span>
            <input
              name="deposit"
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              className="input input-bordered w-full"
            />
          </label>
        </div>

        <label className="form-control w-full">
          <span className="label-text">Street address (not shown publicly)</span>
          <input
            name="addressStreet"
            className="input input-bordered w-full"
            placeholder="1234 Figueroa St"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="form-control w-full">
            <span className="label-text">City</span>
            <input
              name="city"
              required
              className="input input-bordered w-full"
              placeholder="Los Angeles"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">State</span>
            <input
              name="state"
              required
              className="input input-bordered w-full"
              placeholder="CA"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">Postal code</span>
            <input
              name="postalCode"
              required
              className="input input-bordered w-full"
              placeholder="90007"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text">Available from</span>
            <input
              name="availableStart"
              type="date"
              required
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">Available until</span>
            <input
              name="availableEnd"
              type="date"
              required
              className="input input-bordered w-full"
            />
          </label>
        </div>

        <label className="form-control w-full">
          <span className="label-text">Utilities</span>
          <select
            name="utilities"
            defaultValue="tenant_pays"
            className="select select-bordered w-full"
          >
            <option value="included">Included</option>
            <option value="partial">Partial</option>
            <option value="tenant_pays">Tenant pays</option>
          </select>
        </label>

        <label className="form-control w-full">
          <span className="label-text">Utility notes</span>
          <textarea
            name="utilitiesNotes"
            rows={2}
            className="textarea textarea-bordered w-full"
            placeholder="Water included; tenant pays electric."
          />
        </label>

        {amenities.length > 0 && (
          <fieldset className="space-y-3">
            <legend className="label-text font-medium">Amenities</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {amenities.map((amenity) => (
                <label key={amenity.id} className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="amenityIds"
                    value={amenity.id}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text">{amenity.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="form-control w-full gap-3">
          <span className="label-text">Photos (optional)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="file-input file-input-bordered w-full"
            onChange={handleFilesSelected}
            disabled={uploading || pending}
          />
          <p className="text-sm text-base-content/70">
            JPEG, PNG, or WebP, up to 4.5 MB each. Photos are compressed in the
            browser.
          </p>
          {imageUrls.map((url) => (
            <input key={url} type="hidden" name="imageUrls" value={url} />
          ))}
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url, index) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Listing photo ${index + 1}`}
                    className="h-24 w-32 rounded-box object-cover"
                  />
                  <button
                    type="button"
                    className="btn btn-circle btn-xs absolute -right-2 -top-2"
                    onClick={() =>
                      setImageUrls((current) =>
                        current.filter((item) => item !== url),
                      )
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-actions justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={pending || uploading}
          >
            {pending ? "Publishing..." : uploading ? "Uploading photos..." : "Publish listing"}
          </button>
        </div>
      </div>
    </form>
  );
}
