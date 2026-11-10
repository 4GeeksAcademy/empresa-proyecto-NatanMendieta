import type { Metadata } from "next";
import { Suspense } from "react";
import { CandidateDetail } from "@/components/candidate-detail";

export const metadata: Metadata = {
  title: "Detalle de candidatura | TrackFlow Tech",
};

async function CandidateContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CandidateDetail key={id} id={id} />;
}

export default function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p role="status" className="py-10 text-zinc-600">Cargando candidatura...</p>}>
      <CandidateContent params={params} />
    </Suspense>
  );
}