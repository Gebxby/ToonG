import { notFound } from "next/navigation";
import Reader from "@/components/Reader";
import { getSession } from "@/lib/auth";
import { episodesOf, getCatalog, imgUrl, type Comic, type Scope } from "@/lib/github";
export const dynamic = "force-dynamic";
export default async function ReadPage({ params }: { params: Promise<{ id: string; ep: string }> }) {
  const { id, ep } = await params;
  const s = await getSession();
  const scope: Scope = s ? "Secret" : "Public";
  let comic: Comic | undefined;
  try { comic = (await getCatalog(scope)).find((c) => c.id === id); } catch { notFound(); }
  if (!comic) notFound();
  const eps = episodesOf(comic), n = Number(ep), pages = eps[n - 1];
  if (!pages?.length) notFound();
  return <Reader email={s?.email ?? null} id={id} title={comic.title} ep={n} total={eps.length} pages={pages.map(imgUrl)} />;
}