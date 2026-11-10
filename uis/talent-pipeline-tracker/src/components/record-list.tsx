"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecords } from "@/lib/api";
import { CandidateForm } from "@/components/candidate-form";
import {
  getStageLabel,
  getStatusLabel,
  STAGE_LABELS,
  STATUS_LABELS,
  type TrackerRecord,
} from "@/types/tracker";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; records: TrackerRecord[] };

const statusStyles: Record<string, string> = {
  received: "bg-sky-50 text-sky-800",
  in_progress: "bg-amber-50 text-amber-800",
  selected: "bg-emerald-50 text-emerald-800",
  discarded: "bg-rose-50 text-rose-800",
};

export function RecordList() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const stage = searchParams.get("stage") ?? "";
  const [draft, setDraft] = useState({ urlSearch, value: urlSearch });
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  if (draft.urlSearch !== urlSearch) {
    setDraft({ urlSearch, value: urlSearch });
  }

  useEffect(() => {
    const controller = new AbortController();
    async function loadRecords() {
      try {
        const records = await getRecords({}, controller.signal);
        if (!controller.signal.aborted) setLoad({ status: "ready", records });
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoad({
            status: "error",
            message: error instanceof Error ? error.message : "No se pudieron cargar las candidaturas.",
          });
        }
      }
    }
    void loadRecords();
    return () => controller.abort();
  }, [attempt]);

  function updateQuery(name: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(name, value);
    else params.delete(name);
    params.delete("page");
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }

  const query = searchParams.toString();
  const search = draft.value.trim().toLocaleLowerCase();
  const records = load.status === "ready" ? load.records.filter((record) =>
    (!status || record.status === status) &&
    (!stage || record.stage === stage) &&
    (!search || record.full_name.toLocaleLowerCase().includes(search) || record.email.toLocaleLowerCase().includes(search)),
  ) : [];
  const hasFilters = Boolean(urlSearch || status || stage);
  const controlStyle = "mt-2 h-11 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20";

  return (
    <>
      <div className="mt-6">
        <button type="button" disabled={load.status !== "ready"} aria-expanded={showCreate} aria-controls="new-candidate" onClick={() => setShowCreate((current) => !current)} className="rounded-md border border-emerald-800 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50">
          {showCreate ? "Cerrar formulario" : "Nueva candidatura"}
        </button>
      </div>
      {showCreate && <section id="new-candidate" aria-labelledby="new-candidate-title" className="mt-6 border-t border-zinc-200 pt-6">
        <h2 id="new-candidate-title" className="text-lg font-semibold">Nueva candidatura</h2>
        <CandidateForm onSaved={(saved) => setLoad((current) => current.status === "ready" ? {
          status: "ready",
          records: [saved, ...current.records.filter((record) => record.id !== saved.id)],
        } : current)} />
      </section>}
      <div role="search" aria-label="Filtrar candidaturas" className="mt-8 grid gap-4 border-y border-zinc-200 py-6 md:grid-cols-[2fr_1fr_1fr]">
        <label className="min-w-0 text-sm font-medium">
          Buscar por nombre o email
          <input
            type="search"
            value={draft.value}
            onChange={(event) => {
              const value = event.target.value;
              setDraft({ urlSearch, value });
              updateQuery("search", value);
            }}
            className={controlStyle}
          />
        </label>
        <label className="min-w-0 text-sm font-medium">
          Estado
          <select value={status} onChange={(event) => updateQuery("status", event.target.value)} className={controlStyle}>
            <option value="">Todos los estados</option>
            {status && !Object.hasOwn(STATUS_LABELS, status) && <option value={status}>Estado desconocido</option>}
            {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm font-medium">
          Etapa
          <select value={stage} onChange={(event) => updateQuery("stage", event.target.value)} className={controlStyle}>
            <option value="">Todas las etapas</option>
            {stage && !Object.hasOwn(STAGE_LABELS, stage) && <option value={stage}>Etapa desconocida</option>}
            {Object.entries(STAGE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>

      {load.status === "loading" && <p role="status" className="py-12 text-zinc-600">Cargando candidaturas...</p>}
      {load.status === "error" && (
        <div className="py-10">
          <p role="alert" className="break-words text-rose-800">{load.message}</p>
          <button type="button" className="mt-4 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-700" onClick={() => {
            setLoad({ status: "loading" });
            setAttempt((value) => value + 1);
          }}>Reintentar</button>
        </div>
      )}
      {load.status === "ready" && (
        <>
          <p role="status" className="py-5 text-sm text-zinc-500">
            {records.length} {records.length === 1 ? "candidatura" : "candidaturas"}
          </p>
          {records.length === 0 ? (
            <p className="border-t border-zinc-200 py-10 text-zinc-600">
              {hasFilters ? "No hay candidaturas que coincidan con los filtros." : "Todavía no hay candidaturas."}
            </p>
          ) : (
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <caption className="sr-only">Listado de candidaturas</caption>
              <thead className="hidden border-y border-zinc-200 bg-zinc-100 text-zinc-600 md:table-header-group">
                <tr>
                  <th scope="col" className="w-[30%] px-4 py-3 font-medium">Nombre</th>
                  <th scope="col" className="w-[28%] px-4 py-3 font-medium">Puesto</th>
                  <th scope="col" className="w-[18%] px-4 py-3 font-medium">Estado</th>
                  <th scope="col" className="w-[24%] px-4 py-3 font-medium">Etapa</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {records.map((record) => (
                  <tr key={record.id} className="grid gap-3 border-b border-zinc-200 py-5 hover:bg-white md:table-row md:py-0">
                    <th scope="row" className="min-w-0 break-words font-medium md:px-4 md:py-5">
                      <Link href={`/candidates/${encodeURIComponent(record.id)}${query ? `?${query}` : ""}`} className="text-emerald-800 underline decoration-emerald-800/30 underline-offset-4 hover:decoration-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700">
                        {record.full_name}
                      </Link>
                    </th>
                    <td className="min-w-0 break-words text-zinc-600 md:px-4 md:py-5"><span className="mr-2 font-medium md:hidden">Puesto:</span>{record.position}</td>
                    <td className="min-w-0 md:px-4 md:py-5"><span className="mr-2 font-medium md:hidden">Estado:</span><span className={`inline-block max-w-full break-words rounded px-2 py-1 text-xs font-medium ${Object.hasOwn(statusStyles, record.status) ? statusStyles[record.status] : "bg-zinc-100 text-zinc-700"}`}>{getStatusLabel(record.status)}</span></td>
                    <td className="min-w-0 break-words text-zinc-600 md:px-4 md:py-5"><span className="mr-2 font-medium md:hidden">Etapa:</span>{getStageLabel(record.stage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
}