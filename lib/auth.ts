import crypto from "crypto";
import { cookies } from "next/headers";
export const COOKIE = "toong_session";
const key = () => process.env.AUTH_SECRET || "dev-secret";
const mac = (p: string) => crypto.createHmac("sha256", key()).update(p).digest("base64url");

export function signSession(email: string) {
  const p = Buffer.from(JSON.stringify({ email, exp: Date.now() + 7 * 864e5 })).toString("base64url");
  return `${p}.${mac(p)}`;
}
export function checkAccount(email: string, password: string) {
  for (const i of [1, 2, 3]) {
    const e = process.env[`ACCOUNT_${i}_EMAIL`], p = process.env[`ACCOUNT_${i}_PASSWORD`];
    if (e && p && e.toLowerCase() === email.trim().toLowerCase() && p === password) return e;
  }
  return null;
}
export async function getSession(): Promise<{ email: string } | null> {
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t) return null;
  const [p, s] = t.split(".");
  if (!p || !s || mac(p) !== s) return null;
  try {
    const d = JSON.parse(Buffer.from(p, "base64url").toString());
    return d.exp > Date.now() ? { email: d.email } : null;
  } catch { return null; }
}
