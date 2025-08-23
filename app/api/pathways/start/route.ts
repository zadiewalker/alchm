import { NextRequest, NextResponse } from "next/server";
import { getDb, getUidFromSessionCookie } from "@/lib/firebaseAdmin";
export async function POST(req: NextRequest) {
  const { slug } = await req.json().catch(() => ({}));
  if (!slug) return NextResponse.json({ error: "missing_slug" }, { status: 400 });
  const uid = await getUidFromSessionCookie(req.headers.get("cookie") ?? "");
  if (!uid) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const ref = getDb().collection("userPathways").doc(`${uid}_${slug}`);
  await ref.set({ uid, slug, status: "active", startedAt: new Date(), currentDay: 1, completedDays: [], nextAt: new Date() }, { merge: true });
  return NextResponse.json({ ok: true });
}
