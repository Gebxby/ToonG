"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loadProfile, saveProfile, type Profile } from "@/lib/profile";

function resize(file: File): Promise<string> {
  return new Promise((res) => {
    const img = new Image(); const u = URL.createObjectURL(file);
    img.onload = () => {
      const s = 256, c = document.createElement("canvas"); c.width = c.height = s;
      const m = Math.min(img.width, img.height);
      c.getContext("2d")!.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
      URL.revokeObjectURL(u); res(c.toDataURL("image/jpeg", 0.85));
    };
    img.src = u;
  });
}
export default function ProfilePage() {
  const router = useRouter(), file = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState(""), [p, setP] = useState<Profile | null>(null), [saved, setSaved] = useState(false);
  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => {
      if (!d.email) return router.replace("/login");
      setEmail(d.email); setP(loadProfile(d.email));
    });
  }, [router]);
  if (!p) return null;
  const upd = (x: Partial<Profile>) => { setP({ ...p, ...x }); setSaved(false); };
  const save = () => { saveProfile(email, p); setSaved(true); window.dispatchEvent(new Event("popstate")); };
  const f = "w-full rounded-2xl border-2 border-petal bg-white px-4 py-3 outline-none focus:border-berry";
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-xl shadow-berry/10">
        <h1 className="text-3xl font-extrabold text-berry">Profilku</h1>
        <div className="flex items-center gap-4">
          {p.avatar ? <img src={p.avatar} alt="Foto profil" className="h-24 w-24 rounded-full object-cover ring-4 ring-petal" /> : <span className="grid h-24 w-24 place-items-center rounded-full bg-petal text-4xl font-extrabold text-berry">{p.name[0]?.toUpperCase()}</span>}
          <div className="flex flex-col gap-2">
            <input ref={file} type="file" accept="image/*" hidden onChange={async (e) => { const x = e.target.files?.[0]; if (x) upd({ avatar: await resize(x) }); }} />
            <button onClick={() => file.current?.click()} className="rounded-full bg-berry px-4 py-2 text-sm font-bold text-blush">Tambah foto</button>
            {p.avatar && <button onClick={() => upd({ avatar: "" })} className="rounded-full border-2 border-berry px-4 py-2 text-sm font-bold text-berry">Hapus foto</button>}
          </div>
        </div>
        <p className="text-sm text-plum/60">{email}</p>
        <input className={f} maxLength={30} placeholder="Nama" value={p.name} onChange={(e) => upd({ name: e.target.value })} />
        <textarea className={f} rows={3} maxLength={200} placeholder="Deskripsi singkat tentang kamu" value={p.bio} onChange={(e) => upd({ bio: e.target.value })} />
        <button onClick={save} className="rounded-full bg-berry px-6 py-3 font-bold text-blush hover:bg-plum">Simpan perubahan</button>
        {saved && <span className="ml-3 font-bold text-berry">Tersimpan.</span>}
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-xl shadow-berry/10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-berry">Riwayat membaca</h2>
          {p.history.length > 0 && <button onClick={() => { const n = { ...p, history: [] }; setP(n); saveProfile(email, n); }} className="text-sm font-bold text-berry hover:underline">Hapus semua</button>}
        </div>
        {p.history.length === 0 ? <p className="text-plum/60">Belum ada riwayat. Buka komik dari beranda untuk mulai membaca.</p> : (
          <ul className="divide-y divide-petal">
            {p.history.map((h) => (
              <li key={`${h.id}-${h.ep}`}>
                <Link href={`/read/${h.id}/${h.ep}`} className="flex items-center justify-between py-3 hover:text-berry">
                  <span className="font-bold">{h.title} · Eps {h.ep}</span>
                  <span className="text-sm text-plum/60">{new Date(h.at).toLocaleDateString("id-ID")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
