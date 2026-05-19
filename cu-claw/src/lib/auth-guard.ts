import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.banned) redirect("/login?error=banned");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/");
  return user;
}

export async function getOptionalUser() {
  const session = await auth();
  return session?.user ?? null;
}
