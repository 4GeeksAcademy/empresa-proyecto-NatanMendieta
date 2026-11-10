import type { Metadata } from "next";
import { Suspense } from "react";
import { RecordList } from "@/components/record-list";

export const metadata: Metadata = {
  title: "Candidaturas | TrackFlow Tech",
  description: "Gestor interno de candidaturas de TrackFlow Tech.",
};

export default function Home() {
  return (
    <section aria-labelledby="page-title">
      <h1 id="page-title" className="text-3xl font-semibold">Candidaturas</h1>
      <Suspense fallback={<p role="status" className="py-10 text-zinc-600">Cargando candidaturas...</p>}>
        <RecordList />
      </Suspense>
    </section>
  );
}
