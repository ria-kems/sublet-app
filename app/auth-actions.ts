"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";

function safeRedirectTo(path: unknown) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function isAuthErrorRedirect(url: string) {
  try {
    const parsed = url.startsWith("http")
      ? new URL(url)
      : new URL(url, "http://localhost");
    return (
      parsed.searchParams.has("error") || parsed.pathname.includes("/signin")
    );
  } catch {
    return url.includes("error=") || url.includes("/signin");
  }
}

export async function signInWithCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeRedirectTo(formData.get("callbackUrl"));

  let result: string | undefined;
  try {
    result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    console.error("[auth] Sign-in failed", error);
    redirect(
      `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=CredentialsSignin`,
    );
  }

  if (typeof result === "string" && isAuthErrorRedirect(result)) {
    redirect(
      `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=CredentialsSignin`,
    );
  }

  revalidatePath("/", "layout");
  redirect(callbackUrl);
}

export async function signOutAction() {
  await signOut({ redirect: false, redirectTo: "/" });
  revalidatePath("/", "layout");
  redirect("/");
}
