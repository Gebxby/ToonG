// Struktur repo: Public/public-catalog.json dan Secret/secret-catalog.json
// Katalog: [{ id, title, synopsis, coverUrl, pages: ["Secret/EPS1p1.png", ...] }]
// Opsional multi-episode: "episodes": [[...halaman eps 1], [...halaman eps 2]]
export type Scope = "Public" | "Secret";
export type Comic = {
  id: string;
  title: string;
  synopsis: string;
  coverUrl?: string;
  pages?: string[];
  episodes?: string[][];
};

const headers = (raw = false): HeadersInit => {
  const token = process.env.GITHUB_TOKEN;
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
};

const url = (path: string) => {
  const baseUrl = (
    process.env.EXPO_PUBLIC_RAW_URL ??
    `https://api.github.com/repos/${process.env.GITHUB_OWNER ?? "Gebxby"}/${process.env.GITHUB_REPO ?? "komik-app"}/contents`
  ).replace(/\/+$/, "");
  const contentUrl = `${baseUrl}/${path.split("/").filter(Boolean).map(encodeURIComponent).join("/")}`;
  const branch = process.env.GITHUB_BRANCH;
  return branch ? `${contentUrl}?ref=${encodeURIComponent(branch)}` : contentUrl;
};

async function ensureOk(response: Response, path: string) {
  if (response.ok) return;
  let detail = "";
  try {
    const body = (await response.json()) as { message?: string };
    detail = body.message ? `: ${body.message}` : "";
  } catch {}
  throw new Error(`GitHub ${response.status} untuk ${path}${detail}`);
}

export async function ghRaw(path: string) {
  return fetch(url(path), { headers: headers(true), next: { revalidate: 300 } });
}

const norm = (scope: Scope, p: string) =>
  `${scope}/${p.replace(/^\/+/, "").replace(/^(public|secret)\//i, "")}`;

export async function getCatalog(scope: Scope): Promise<Comic[]> {
  const names = [`${scope}/${scope.toLowerCase()}-catalog.json`, `${scope}/catalog.json`];
  let res: Response | null = null, used = names[0];
  for (const n of names) {
    used = n;
    res = await ghRaw(n);
    if (res.ok) break;
  }
  await ensureOk(res!, used);
  const data = (await res!.json()) as unknown;
  if (!Array.isArray(data)) throw new Error(`Format katalog ${scope} tidak valid`);
  return (data as Comic[]).map((c) => ({
    ...c,
    coverUrl: norm(scope, c.coverUrl ?? "TitleEps1.png"),
    pages: (c.pages ?? []).map((p) => norm(scope, p)),
    episodes: c.episodes?.map((ep) => ep.map((p) => norm(scope, p))),
  }));
}

export const episodesOf = (c: Comic): string[][] =>
  c.episodes?.length ? c.episodes : c.pages?.length ? [c.pages] : [];

export const imgUrl = (path: string) => `/api/img?p=${encodeURIComponent(path)}`;