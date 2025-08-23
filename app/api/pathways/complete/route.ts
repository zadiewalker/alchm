import { NextRequest, NextResponse } from "next/server";
import { getDb, getUidFromSessionCookie } from "@/lib/firebaseAdmin";
import * as admin from "firebase-admin";
export async function POST(req: NextRequest) {
  const { slug, day } = await req.json().catch(() => ({}));
  if (!slug || typeof day !== "number") return NextResponse.json({ error: "missing_slug_or_day" }, { status: 400 });
  const uid = await getUidFromSessionCookie(req.headers.get("cookie") ?? "");
  if (!uid) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const db = getDb();
  const ref = db.collection("userPathways").doc(`${uid}_${slug}`);
  await ref.set({
    uid, slug, status: "active",
    currentDay: day + 1,
    completedDays: admin.firestore.FieldValue.arrayUnion(day),
    updatedAt: new Date(), nextAt: new Date(Date.now() + 86400000)
  }, { merge: true });
  const total = (await db.collection("pathways").doc(slug).get()).data()?.days ?? 9999;
  if (day >= total) await ref.set({ status: "complete" }, { merge: true });
  return NextResponse.json({ ok: true });
}
