import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-semibold">Listing not found</h1>
      <p className="text-base-content/70">
        This listing may have been removed or is no longer available.
      </p>
      <Link href="/search" className="btn btn-primary">
        Browse listings
      </Link>
    </main>
  );
}
