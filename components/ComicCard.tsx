"use client";
import Link from "next/link";
import { useRef, useState } from "react";
type Props = { id: string; title: string; synopsis: string; cover: string; fallback?: string; index?: number };
export default function ComicCard({ id, title, synopsis, cover, fallback, index = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState(cover);
  const touch = useRef(false);
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}>
      <div
        className={`relative aspect-[3/4] cursor-pointer overflow-hidden rounded-3xl bg-petal shadow-lg shadow-berry/20 ring-2 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-berry/30 ${open ? "-translate-y-1 shadow-xl shadow-berry/30 ring-rose" : "ring-transparent"}`}
        onPointerDown={(e) => { touch.current = e.pointerType !== "mouse"; }}
        onMouseEnter={() => !touch.current && setOpen(true)}
        onMouseLeave={() => !touch.current && setOpen(false)}
        onClick={() => touch.current && setOpen((v) => !v)}
      >
        <img src={src} alt={title} loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ease-out ${open ? "scale-110" : "scale-100"}`}
          onError={() => { if (fallback && src !== fallback) setSrc(fallback); }} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/90 to-transparent p-4 pt-12">
          <h3 className="text-lg font-extrabold leading-tight text-blush">{title}</h3>
        </div>
        <div className={`absolute inset-0 flex flex-col justify-end bg-plum/85 p-4 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <div className={`flex flex-col gap-3 transition-all duration-300 ease-out ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            <h3 className="text-xl font-extrabold text-petal">{title}</h3>
            <p className="line-clamp-5 text-sm text-blush/90">{synopsis}</p>
            <p className="text-sm font-bold text-blush">Baca sekarang?</p>
            <div className="flex gap-2">
              <Link href={`/read/${id}/1`} onClick={(e) => e.stopPropagation()} className="flex-1 rounded-full bg-rose py-2 text-center font-bold text-plum transition duration-200 hover:bg-petal active:scale-95">Baca</Link>
              <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="flex-1 rounded-full border-2 border-petal py-2 font-bold text-petal transition duration-200 hover:bg-petal/20 active:scale-95">Tidak</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}