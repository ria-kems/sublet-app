"use client";

import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

import { signInWithCredentials } from "@/app/auth-actions";

const DEMO_ACCOUNTS = [
  "alex.rivera.sublets@example.com",
  "jordan.lee@example.com",
  "sam.patel@example.com",
  "riley.chen@example.com",
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  return (
    <form action={signInWithCredentials} className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {error ? (
          <div className="alert alert-error">
            <span>Invalid email or password.</span>
          </div>
        ) : null}

        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <label className="form-control w-full">
          <span className="label-text">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input input-bordered w-full"
            placeholder="jordan.lee@example.com"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="input input-bordered w-full"
          />
        </label>

        <SubmitButton />

        <div className="rounded-box bg-base-200 p-3 text-sm text-base-content/80">
          <p className="font-medium">Demo accounts</p>
          <ul className="mt-2 list-inside list-disc">
            {DEMO_ACCOUNTS.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
}
