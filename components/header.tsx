import Link from "next/link";

export function Header() {
  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-4">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl font-semibold">
          Sublet Marketplace
        </Link>
      </div>
      <nav className="flex-none gap-2">
        <Link href="/search" className="btn btn-ghost btn-sm">
          Listings
        </Link>
        <button type="button" className="btn btn-outline btn-sm" disabled>
          Sign in
        </button>
      </nav>
    </header>
  );
}
