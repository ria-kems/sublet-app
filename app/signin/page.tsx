import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInForm } from "@/components/sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const rawCallback = params.callbackUrl;
  const callbackUrl =
    typeof rawCallback === "string" &&
    rawCallback.startsWith("/") &&
    !rawCallback.startsWith("//")
      ? rawCallback
      : "/";

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="text-base-content/70">
          Use a demo account to list a sublet. Browsing stays open without
          signing in.
        </p>
      </div>
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  );
}
