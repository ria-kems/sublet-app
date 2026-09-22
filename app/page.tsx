import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Find your next sublet
        </h1>
        <p className="text-lg text-base-content/70">
          Browse short-term leases across the city or list your place for
          students, interns, and traveling professionals.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/search" className="btn btn-primary btn-lg">
          Search Sublets
        </Link>
        <Link href="/create-listing" className="btn btn-outline btn-lg">
          List a Sublet
        </Link>
      </div>
    </main>
  );
}
