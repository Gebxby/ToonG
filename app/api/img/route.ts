import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ghRaw } from "@/lib/github";
// Proxy gambar: PAT tetap di server, folder secret hanya untuk user login.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p") ?? "";
  if (p.includes("..") || !/^(public|secret)\//.test(p)) return new NextResponse("Bad request", { status: 400 });
  if (p.startsWith("secret/") && !(await getSession())) return new NextResponse("Unauthorized", { status: 401 });
  const r = await ghRaw(p);
  if (!r.ok) return new NextResponse("Not found", { status: 404 });
  const ext = p.split(".").pop()!.toLowerCase();
  const type = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" }[ext] ?? "application/octet-stream";
  return new NextResponse(r.body, { headers: { "Content-Type": type, "Cache-Control": p.startsWith("secret/") ? "private, max-age=3600" : "public, max-age=3600" } });
}
