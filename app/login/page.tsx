"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState(""), [password, setPw] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true); setErr("");
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (r.ok) { router.push("/"); router.refresh(); } else { setErr((await r.json()).error); setBusy(false); }
  };
  const f = "w-full rounded-2xl border-2 border-petal bg-white px-4 py-3 outline-none focus:border-berry";
  return (
    <main className="mx-auto mt-10 max-w-sm px-4">
      <div className="space-y-4 rounded-3xl bg-white p-6 shadow-xl shadow-berry/20">
        <h1 className="text-3xl font-extrabold text-berry">Masuk ke ToonG</h1>
        <input className={f} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={f} type="password" placeholder="Password" value={password} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {err && <p className="text-sm font-bold text-berry">{err}</p>}
        <button onClick={submit} disabled={busy} className="w-full rounded-full bg-berry py-3 font-bold text-blush hover:bg-plum disabled:opacity-50">{busy ? "Memeriksa…" : "Masuk"}</button>
      </div>
    </main>
  );
}
