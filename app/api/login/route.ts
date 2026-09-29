import { NextResponse } from "next/server";
import { COOKIE, checkAccount, signSession } from "@/lib/auth";
export async function POST(req: Request) {
  const { email = "", password = "" } = await req.json().catch(() => ({}));
  const ok = checkAccount(email, password);
  if (!ok) return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, signSession(ok), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 604800, secure: process.env.NODE_ENV === "production" });
  return res;
}
