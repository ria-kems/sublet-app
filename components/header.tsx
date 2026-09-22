import { connection } from "next/server";
import Link from "next/link";

import { auth } from "@/auth";
import { AuthControls } from "@/components/auth-controls";

export async function Header() {
  await connection();
  const session = await auth();

  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-4">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl font-semibold">
          Sublet Marketplace
        </Link>
      </div>
      <nav className="flex-none items-center gap-2">
        <Link href="/search" className="btn btn-ghost btn-sm">
          Listings
        </Link>
        <Link href="/create-listing" className="btn btn-ghost btn-sm">
          List a sublet
        </Link>
        <AuthControls user={session?.user ?? null} />
      </nav>
    </header>
  );
}
