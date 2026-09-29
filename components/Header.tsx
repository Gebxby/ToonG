"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadProfile } from "@/lib/profile";
export default function Header({ email }: { email: string | null }) {
  const path = usePathname(), router = useRouter();
  const [av, setAv] = useState("");
  useEffect(() => { if (email) setAv(loadProfile(email).avatar); }, [email, path]);
  if (path.startsWith("/read")) return null;
  const out = async () => { await fetch("/api/logout", { method: "POST" }); router.push("/"); router.refresh(); };
  return (
    <header className="sticky top-0 z-30 border-b border-petal bg-blush/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-3xl font-extrabold text-berry">Toon<span className="rounded-lg bg-berry px-1.5 text-blush">G</span></Link>
        <nav className="flex items-center gap-3 text-sm font-bold">
          {email ? (<>
            <Link href="/profile" className="flex items-center gap-2 rounded-full bg-petal py-1 pl-1 pr-3 hover:bg-rose/60">
              {av ? <img src={av} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-berry text-blush">{email[0].toUpperCase()}</span>}
              Profil
            </Link>
            <button onClick={out} className="text-berry hover:underline">Keluar</button>
          </>) : <Link href="/login" className="rounded-full bg-berry px-4 py-2 text-blush hover:bg-plum">Masuk</Link>}
        </nav>
      </div>
    </header>
  );
}
