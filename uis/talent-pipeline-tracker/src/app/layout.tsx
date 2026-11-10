import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candidaturas | TrackFlow Tech",
  description: "Gestor interno de candidaturas de TrackFlow Tech.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <header className="border-b border-zinc-200 bg-white">
          <div className="app-container flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
            <Link href="/" aria-label="TrackFlow Tech: candidaturas" className="rounded-sm text-2xl font-semibold text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
              TrackFlow <span className="font-normal text-emerald-700">Tech</span>
            </Link>
            <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="text-zinc-500">Selección de talento</span>
              <Link href="/" className="rounded-sm font-medium text-emerald-800 underline decoration-emerald-800/30 underline-offset-4 hover:decoration-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">Candidaturas</Link>
            </nav>
          </div>
          <div className="border-t border-zinc-100 bg-zinc-50">
            <p className="app-container py-3 text-sm leading-6 text-zinc-700">Campaña prioritaria: Asistente de Dirección · Sede Zaragoza</p>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="app-container app-content focus:outline-none">{children}</main>
      </body>
    </html>
  );
}
