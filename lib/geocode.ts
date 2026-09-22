type AddressInput = {
  street?: string;
  city: string;
  state: string;
  postalCode: string;
};

type GeocodeResult = {
  latitude: string;
  longitude: string;
};

type MapboxFeature = {
  center?: [number, number];
};

type MapboxResponse = {
  features?: MapboxFeature[];
};

export async function geocodeAddress(
  address: AddressInput,
): Promise<GeocodeResult | null> {
  const token = process.env.MAPBOX_GEOCODING_TOKEN;
  if (!token) {
    return null;
  }

  const query = [address.street, address.city, address.state, address.postalCode]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");

  if (!query) {
    return null;
  }

  try {
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
    );
    url.searchParams.set("limit", "1");
    url.searchParams.set("access_token", token);

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as MapboxResponse;
    const center = payload.features?.[0]?.center;
    if (!center || center.length < 2) {
      return null;
    }

    const [longitude, latitude] = center;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return {
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    };
  } catch {
    return null;
  }
}
