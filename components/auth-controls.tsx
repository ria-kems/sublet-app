"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOutAction } from "@/app/auth-actions";

type AuthControlsProps = {
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
};

export function AuthControls({ user }: AuthControlsProps) {
  const pathname = usePathname();
  const callbackUrl =
    !pathname || pathname.startsWith("/signin") ? "/" : pathname;

  if (!user) {
    return (
      <Link
        href={`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className="btn btn-outline btn-sm"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-8 rounded-full ring ring-base-300">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Account"}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center bg-base-300 text-xs">
              {(user.name ?? "?").slice(0, 1)}
            </div>
          )}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-10 mt-3 w-44 rounded-box bg-base-100 p-2 shadow"
      >
        {user.name ? (
          <li className="menu-title px-2 py-1 text-xs">{user.name}</li>
        ) : null}
        <li>
          <form action={signOutAction}>
            <button type="submit" className="w-full text-left">
              Sign out
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
}
