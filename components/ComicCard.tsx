"use client";
import Link from "next/link";
import { useRef, useState } from "react";
export default function ComicCard({ id, title, synopsis, cover }: { id: string; title: string; synopsis: string; cover: string }) {
  const [open, setOpen] = useState(false);
  const touch = useRef(false);
  return (
    <div
      className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-3xl bg-petal shadow-lg shadow-berry/20 ring-2 ring-transparent transition hover:ring-rose"
      onPointerDown={(e) => { touch.current = e.pointerType !== "mouse"; }}
      onMouseEnter={() => !touch.current && setOpen(true)}
      onMouseLeave={() => !touch.current && setOpen(false)}
      onClick={() => touch.current && setOpen((v) => !v)}
    >
      <img src={cover} alt={title} loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/90 to-transparent p-4 pt-12">
        <h3 className="text-lg font-extrabold leading-tight text-blush">{title}</h3>
      </div>
      <div className={`absolute inset-0 flex flex-col justify-end gap-3 bg-plum/85 p-4 transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <h3 className="text-xl font-extrabold text-petal">{title}</h3>
        <p className="line-clamp-5 text-sm text-blush/90">{synopsis}</p>
        <p className="text-sm font-bold text-blush">Baca sekarang?</p>
        <div className="flex gap-2">
          <Link href={`/read/${id}/1`} onClick={(e) => e.stopPropagation()} className="flex-1 rounded-full bg-rose py-2 text-center font-bold text-plum hover:bg-petal">Baca</Link>
          <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="flex-1 rounded-full border-2 border-petal py-2 font-bold text-petal hover:bg-petal/20">Tidak</button>
        </div>
      </div>
    </div>
  );
}
