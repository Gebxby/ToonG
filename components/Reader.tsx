"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addHistory } from "@/lib/profile";
type P = { email: string | null; id: string; title: string; ep: number; total: number; pages: string[] };
export default function Reader({ email, id, title, ep, total, pages }: P) {
  const [ui, setUi] = useState(false); // navigasi tersembunyi sampai layar diketuk
  const [z, setZ] = useState(1);
  useEffect(() => { if (email) addHistory(email, { id, title, ep }); }, [email, id, title, ep]);
  const btn = "grid h-12 min-w-12 place-items-center rounded-full bg-berry px-4 text-xl font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-40";
  const anim = "transition-all duration-300 ease-out";
  const hide = "pointer-events-none opacity-0";
  return (
    <div className="fixed inset-0 bg-white" onClick={() => setUi((v) => !v)}>
      {/* Satu strip panjang: lebar mengikuti layar (x zoom), tinggi otomatis, tanpa celah antar gambar */}
      <div className="h-full overflow-auto overscroll-contain">
        <div style={{ width: `${z * 100}%` }}>
          {pages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              draggable={false}
              loading={i < 3 ? "eager" : "lazy"}
              decoding="async"
              className="block h-auto w-full select-none"
            />
          ))}
          <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 bg-white px-4 text-center text-plum" style={{ width: "100vw", maxWidth: "100%" }}>
            <p className="font-display text-2xl font-extrabold">Selesai eps {ep}</p>
            {ep < total && <Link href={`/read/${id}/${ep + 1}`} onClick={(e) => e.stopPropagation()} className={btn}>Episode berikutnya</Link>}
            <Link href="/" onClick={(e) => e.stopPropagation()} className="font-bold text-berry underline">Kembali ke beranda</Link>
          </div>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()} aria-hidden={!ui}>
        <div className={`absolute inset-x-0 top-0 flex items-center gap-3 bg-white/90 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-plum shadow-md shadow-berry/10 backdrop-blur ${anim} ${ui ? "translate-y-0 opacity-100" : `-translate-y-full ${hide}`}`}>
          <Link href="/" className={btn} aria-label="Kembali">←</Link>
          <div className="min-w-0 flex-1"><p className="truncate font-bold">{title}</p><p className="text-sm opacity-70">Episode {ep} dari {total}</p></div>
          {ep > 1 && <Link href={`/read/${id}/${ep - 1}`} className={btn} aria-label="Episode sebelumnya">‹</Link>}
          {ep < total && <Link href={`/read/${id}/${ep + 1}`} className={btn} aria-label="Episode berikutnya">›</Link>}
        </div>
        <div className={`absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 flex flex-col gap-3 ${anim} ${ui ? "translate-x-0 opacity-100" : `translate-x-20 ${hide}`}`}>
          <button className={btn} aria-label="Perbesar" onClick={() => setZ((v) => Math.min(3, +(v + 0.25).toFixed(2)))}>＋</button>
          <button className={btn} aria-label="Perkecil" disabled={z <= 1} onClick={() => setZ((v) => Math.max(1, +(v - 0.25).toFixed(2)))}>－</button>
        </div>
      </div>
    </div>
  );
}