export type Hist = { id: string; title: string; ep: number; at: number };
export type Profile = { name: string; bio: string; avatar: string; history: Hist[] };
const k = (e: string) => `toong:${e.toLowerCase()}`;
export function loadProfile(email: string): Profile {
  const base: Profile = { name: email.split("@")[0], bio: "", avatar: "", history: [] };
  try { const r = localStorage.getItem(k(email)); if (r) return { ...base, ...JSON.parse(r) }; } catch {}
  return base;
}
export function saveProfile(email: string, p: Profile) {
  try { localStorage.setItem(k(email), JSON.stringify(p)); } catch {}
}
export function addHistory(email: string, h: Omit<Hist, "at">) {
  const p = loadProfile(email);
  p.history = [{ ...h, at: Date.now() }, ...p.history.filter((x) => !(x.id === h.id && x.ep === h.ep))].slice(0, 50);
  saveProfile(email, p);
}
