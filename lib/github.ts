// Asumsi struktur repo:
//  {public|secret}/catalog.json            -> [{ "id": "nama-folder", "title": "...", "synopsis": "..." }]
//  {public|secret}/{id}/TitleEps1.png      -> cover
//  {public|secret}/{id}/{folder-episode}/  -> berisi gambar halaman (urut nama file)
export type Scope = "public" | "secret";
export type Comic = { id: string; title: string; synopsis: string };

const o = () => process.env.GITHUB_OWNER, r = () => process.env.GITHUB_REPO;
const headers = (raw = false) => ({
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});
const url = (path: string) =>
  `https://api.github.com/repos/${o()}/${r()}/contents/${path.split("/").map(encodeURIComponent).join("/")}` +
  (process.env.GITHUB_BRANCH ? `?ref=${process.env.GITHUB_BRANCH}` : "");

export async function ghRaw(path: string) {
  return fetch(url(path), { headers: headers(true), next: { revalidate: 300 } });
}
async function ghList(path: string): Promise<{ name: string; type: string; path: string }[]> {
  const res = await fetch(url(path), { headers: headers(), next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`GitHub ${res.status} untuk ${path}`);
  return res.json();
}
const nat = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

export async function getCatalog(scope: Scope): Promise<Comic[]> {
  const res = await ghRaw(`${scope}/catalog.json`);
  if (!res.ok) throw new Error(`Katalog ${scope} gagal dimuat (${res.status})`);
  return JSON.parse(await res.text());
}
export async function getEpisodes(scope: Scope, id: string) {
  const items = await ghList(`${scope}/${id}`);
  return items.filter((i) => i.type === "dir").map((i) => i.name).sort(nat);
}
export async function getPages(scope: Scope, id: string, ep: string) {
  const items = await ghList(`${scope}/${id}/${ep}`);
  return items.filter((i) => /\.(png|jpe?g|webp|gif)$/i.test(i.name)).sort((a, b) => nat(a.name, b.name)).map((i) => i.path);
}
export const imgUrl = (path: string) => `/api/img?p=${encodeURIComponent(path)}`;
