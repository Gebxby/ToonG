import { notFound } from "next/navigation";
import Reader from "@/components/Reader";
import { getSession } from "@/lib/auth";
import { getCatalog, getEpisodes, getPages, imgUrl, type Scope } from "@/lib/github";
export const dynamic = "force-dynamic";
export default async function ReadPage({ params }: { params: Promise<{ id: string; ep: string }> }) {
  const { id, ep } = await params;
  const s = await getSession();
  const scope: Scope = s ? "secret" : "public";
  try {
    const [catalog, eps] = await Promise.all([getCatalog(scope), getEpisodes(scope, id)]);
    const n = Number(ep), folder = eps[n - 1];
    if (!folder || !catalog.some((c) => c.id === id)) notFound();
    const pages = (await getPages(scope, id, folder)).map(imgUrl);
    return <Reader email={s?.email ?? null} id={id} title={catalog.find((c) => c.id === id)!.title} ep={n} total={eps.length} pages={pages} />;
  } catch { notFound(); }
}
