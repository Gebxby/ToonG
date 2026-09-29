import ComicCard from "@/components/ComicCard";

import { getSession } from "@/lib/auth";
import { episodesOf, getCatalog, imgUrl, type Scope } from "@/lib/github";
export const dynamic = "force-dynamic";
export default async function Home() {
  const s = await getSession();
  const scope: Scope = s ? "Secret" : "Public";
  let comics: Awaited<ReturnType<typeof getCatalog>> = [], err = "";
  try { comics = await getCatalog(scope); } catch (e) { err = (e as Error).message; }
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-extrabold text-berry">{s ? "Koleksi eksklusifmu" : "Komik untuk semua"}</h1>
      <p className="mb-6 mt-1 text-plum/70">{s ? "Kamu masuk, jadi semua judul rahasia terbuka." : "Masuk untuk membuka koleksi rahasia."}</p>
      {err && <p className="rounded-2xl bg-petal p-4 font-bold text-berry">Gagal memuat komik: {err}</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {comics.map((c, i) => (
  <ComicCard key={`${c.id}-${i}`} index={i} id={c.id} title={c.title} synopsis={c.synopsis} cover={imgUrl(c.coverUrl!)} fallback={episodesOf(c)[0]?.[0] ? imgUrl(episodesOf(c)[0][0]) : undefined} />
))}
      </div>
    </main>
  );
}