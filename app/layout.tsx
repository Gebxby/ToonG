import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import { getSession } from "@/lib/auth";
export const metadata: Metadata = { title: "ToonG", description: "Baca komik favoritmu." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#E2437F" };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  return (
    <html lang="id"><body>
      <Header email={s?.email ?? null} />
      {children}
    </body></html>
  );
}
