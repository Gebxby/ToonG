"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addHistory } from "@/lib/profile";
type P = { email: string | null; id: string; title: string; ep: number; total: number; pages: string[] };
export default function Reader({ email, id, title, ep, total, pages }: P) {
  const [ui, setUi] = useState(false); // navigasi tersembunyi sampai layar diketuk
  const [z, setZ] = useState(1);
  useEffect(() => { if (email) addHistory(email, { id, title, ep }); }, [email, id, title, ep]);
  const btn = "grid h-12 min-w-12 place-items-center rounded-full bg-berry px-4 text-xl font-extrabold text-blush shadow-lg active:scale-95 disabled:opacity-40";
  return (
    <div className="fixed inset-0 bg-black" onClick={() => setUi((v) => !v)}>
      <div className="h-full snap-y snap-mandatory overflow-y-auto">
        {pages.map((src) => (
          <section key={src} className="flex h-dvh snap-start overflow-auto">
            <img src={src} alt="" draggable={false} loading="lazy" className="m-auto select-none"
              style={z === 1 ? { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } : { width: `${z * 100}%`, maxWidth: "none", height: "auto" }} />
          </section>
        ))}
        <div className="flex h-dvh snap-start flex-col items-center justify-center gap-4 text-blush">
          <p className="font-display text-2xl">Selesai eps {ep}</p>
          {ep < total && <Link href={`/read/${id}/${ep + 1}`} onClick={(e) => e.stopPropagation()} className={btn}>Episode berikutnya</Link>}
        </div>
      </div>
      {ui && (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-x-0 top-0 flex items-center gap-3 bg-plum/85 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-blush">
            <Link href="/" className={btn} aria-label="Kembali">←</Link>
            <div className="min-w-0 flex-1"><p className="truncate font-bold">{title}</p><p className="text-sm opacity-80">Episode {ep} dari {total}</p></div>
            {ep > 1 && <Link href={`/read/${id}/${ep - 1}`} className={btn} aria-label="Episode sebelumnya">‹</Link>}
            {ep < total && <Link href={`/read/${id}/${ep + 1}`} className={btn} aria-label="Episode berikutnya">›</Link>}
          </div>
          <div className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 flex flex-col gap-3">
            <button className={btn} aria-label="Perbesar" onClick={() => setZ((v) => Math.min(3, +(v + 0.25).toFixed(2)))}>＋</button>
            <button className={btn} aria-label="Perkecil" disabled={z <= 1} onClick={() => setZ((v) => Math.max(1, +(v - 0.25).toFixed(2)))}>－</button>
          </div>
        </div>
      )}
    </div>
  );
}
