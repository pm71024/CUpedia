import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const { nickname } = await req.json();
  if (!nickname || nickname.length < 2 || nickname.length > 20) {
    return NextResponse.json({ error: "昵称需要 2-20 个字符" }, { status: 400 });
  }

  await db
    .update(users)
    .set({ nickname, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ ok: true });
}
