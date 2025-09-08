import { NextRequest, NextResponse } from "next/server";
import { ensureAdmin } from "../../../../src/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json().catch(() => ({}));
  if (!idToken) return NextResponse.json({ error: "missing_id_token" }, { status: 400 });

  ensureAdmin();
  const auth = getAuth();
  const expiresIn = 14 * 24 * 60 * 60 * 1000; // 14 days
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "__session",
    value: sessionCookie,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(expiresIn / 1000),
  });
  return res;
}
