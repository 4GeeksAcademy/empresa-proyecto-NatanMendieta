"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createNote, deleteNote, getNotes, getRecord, patchRecord } from "@/lib/api";
import { CandidateForm } from "@/components/candidate-form";
import {
  getStageLabel,
  getStatusLabel,
  STAGE_LABELS,
  STATUS_LABELS,
  type PatchRecordInput,
  type RecordStage,
  type RecordStatus,
  type TrackerNote,
  type TrackerRecord,
} from "@/types/tracker";

type Resource<Data> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: Data };

type Feedback = { status: "idle" } | { status: "pending" | "success" | "error"; message: string };
type NoteOperation = { kind: "create" } | { kind: "delete"; id: string } | null;

const controlStyle = "mt-2 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 disabled:bg-zinc-100";
const buttonStyle = "rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50";

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "No se pudo completar la operación.";
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Fecha no disponible" : new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeZone: "UTC" }).format(date);
}

function ExternalLink({ url, children }: { url: string | null; children: ReactNode }) {
  let valid = false;
  try {
    valid = Boolean(url) && ["https:", "http:"].includes(new URL(url!).protocol);
  } catch {}
  return valid ? <a href={url!} target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline underline-offset-4">{children}</a> : <span className="text-zinc-500">No disponible</span>;
}

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  if (feedback.status === "idle") return null;
  return <p role={feedback.status === "error" ? "alert" : "status"} className={`mt-3 break-words text-sm ${feedback.status === "error" ? "text-rose-800" : feedback.status === "success" ? "text-emerald-800" : "text-zinc-600"}`}>{feedback.message}</p>;
}

export function CandidateDetail({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [record, setRecord] = useState<Resource<TrackerRecord>>({ status: "loading" });
  const [notes, setNotes] = useState<Resource<TrackerNote[]>>({ status: "loading" });
  const [recordAttempt, setRecordAttempt] = useState(0);
  const [notesAttempt, setNotesAttempt] = useState(0);
  const [changes, setChanges] = useState<PatchRecordInput>({});
  const [saveFeedback, setSaveFeedback] = useState<Feedback>({ status: "idle" });
  const [noteFeedback, setNoteFeedback] = useState<Feedback>({ status: "idle" });
  const [content, setContent] = useState("");
  const [noteOperation, setNoteOperation] = useState<NoteOperation>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRecord() {
      try {
        const data = await getRecord(id, controller.signal);
        if (!controller.signal.aborted) setRecord({ status: "ready", data });
      } catch (error) {
        if (!controller.signal.aborted) setRecord({ status: "error", message: messageOf(error) });
      }
    }
    void loadRecord();
    return () => controller.abort();
  }, [id, recordAttempt]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadNotes() {
      try {
        const result = await getNotes(id, controller.signal);
        if (!controller.signal.aborted) setNotes({ status: "ready", data: result.data });
      } catch (error) {
        if (!controller.signal.aborted) setNotes({ status: "error", message: messageOf(error) });
      }
    }
    void loadNotes();
    return () => controller.abort();
  }, [id, notesAttempt]);

  async function saveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (record.status !== "ready" || saveFeedback.status === "pending") return;
    const input: PatchRecordInput = {};
    if (changes.status && changes.status !== record.data.status) input.status = changes.status;
    if (changes.stage && changes.stage !== record.data.stage) input.stage = changes.stage;
    if (!Object.keys(input).length) return;
    setSaveFeedback({ status: "pending", message: "Guardando cambios..." });
    try {
      const data = await patchRecord(id, input);
      setRecord({ status: "ready", data });
      setChanges({});
      setSaveFeedback({ status: "success", message: "Cambios guardados." });
    } catch (error) {
      setSaveFeedback({ status: "error", message: messageOf(error) });
    }
  }

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim() || noteOperation || notes.status === "loading") return;
    setNoteOperation({ kind: "create" });
    setNoteFeedback({ status: "pending", message: "Guardando nota..." });
    try {
      await createNote(id, { content: content.trim() });
      setContent("");
      setNoteFeedback({ status: "success", message: "Nota creada." });
      try {
        const result = await getNotes(id);
        setNotes({ status: "ready", data: result.data });
      } catch (error) {
        setNotes({ status: "error", message: `La nota se creó, pero no se pudo actualizar el listado: ${messageOf(error)}` });
      }
    } catch (error) {
      setNoteFeedback({ status: "error", message: messageOf(error) });
    } finally {
      setNoteOperation(null);
    }
  }

  async function removeNote(noteId: string) {
    if (noteOperation || !window.confirm("¿Eliminar esta nota? Esta acción no se puede deshacer.")) return;
    setNoteOperation({ kind: "delete", id: noteId });
    setNoteFeedback({ status: "pending", message: "Eliminando nota..." });
    try {
      await deleteNote(id, noteId);
      setNotes((current) => current.status === "ready" ? { status: "ready", data: current.data.filter((note) => note.id !== noteId) } : current);
      setNoteFeedback({ status: "success", message: "Nota eliminada." });
    } catch (error) {
      setNoteFeedback({ status: "error", message: messageOf(error) });
    } finally {
      setNoteOperation(null);
    }
  }

  const selectedStatus = changes.status ?? (record.status === "ready" ? record.data.status : "");
  const selectedStage = changes.stage ?? (record.status === "ready" ? record.data.stage : "");
  const isDirty = record.status === "ready" && (selectedStatus !== record.data.status || selectedStage !== record.data.stage);
  const saving = saveFeedback.status === "pending";

  return (
    <>
      <Link href={query ? `/?${query}` : "/"} className="text-sm font-medium text-emerald-800 underline underline-offset-4">Volver a candidaturas</Link>
      {record.status === "loading" && <p role="status" className="py-10 text-zinc-600">Cargando candidatura...</p>}
      {record.status === "error" && (
        <div className="py-10">
          <p role="alert" className="break-words text-rose-800">{record.message}</p>
          <button type="button" className={`${buttonStyle} mt-4`} onClick={() => {
            setRecord({ status: "loading" });
            setRecordAttempt((value) => value + 1);
          }}>Reintentar</button>
        </div>
      )}
      {record.status === "ready" && (
        <>
          <h1 className="mt-6 break-words text-3xl font-semibold">{record.data.full_name}</h1>
          <p className="mt-2 break-words text-zinc-600">{record.data.position}</p>
          <section aria-labelledby="candidate-data" className="mt-8 border-t border-zinc-200 py-6">
            <h2 id="candidate-data" className="text-lg font-semibold">Datos de la candidatura</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Email", record.data.email],
                ["Teléfono", record.data.phone],
                ["Puesto", record.data.position],
                ["Años de experiencia", new Intl.NumberFormat("es-ES").format(record.data.experience_years)],
                ["Estado", getStatusLabel(record.data.status)],
                ["Etapa", getStageLabel(record.data.stage)],
                ["Fecha de aplicación", formatDate(record.data.applied_at)],
              ].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-zinc-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}
              <div><dt className="text-zinc-500">LinkedIn</dt><dd className="mt-1"><ExternalLink url={record.data.linkedin_url}>Abrir LinkedIn</ExternalLink></dd></div>
              <div><dt className="text-zinc-500">CV</dt><dd className="mt-1"><ExternalLink url={record.data.cv_url}>Abrir CV</ExternalLink></dd></div>
            </dl>
          </section>

          <section aria-labelledby="edit-candidate-title" className="border-t border-zinc-200 py-6">
            <details>
              <summary id="edit-candidate-title" className="cursor-pointer text-lg font-semibold focus-visible:outline-2 focus-visible:outline-emerald-700">Editar candidatura</summary>
              <CandidateForm record={record.data} onSaved={(saved) => {
                setRecord({ status: "ready", data: saved });
                setChanges({});
                setSaveFeedback({ status: "idle" });
              }} />
            </details>
          </section>

          <section aria-labelledby="pipeline-title" className="border-t border-zinc-200 py-6">
            <h2 id="pipeline-title" className="text-lg font-semibold">Seguimiento</h2>
            <form onSubmit={saveChanges} className="mt-5 max-w-3xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="min-w-0 text-sm font-medium">Estado
                  <select value={selectedStatus} disabled={saving} onChange={(event) => {
                    setChanges((current) => ({ ...current, status: event.target.value as RecordStatus }));
                    setSaveFeedback({ status: "idle" });
                  }} className={controlStyle}>
                    {!Object.hasOwn(STATUS_LABELS, selectedStatus) && <option value={selectedStatus} disabled>Estado desconocido</option>}
                    {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="min-w-0 text-sm font-medium">Etapa
                  <select value={selectedStage} disabled={saving} onChange={(event) => {
                    setChanges((current) => ({ ...current, stage: event.target.value as RecordStage }));
                    setSaveFeedback({ status: "idle" });
                  }} className={controlStyle}>
                    {!Object.hasOwn(STAGE_LABELS, selectedStage) && <option value={selectedStage} disabled>Etapa desconocida</option>}
                    {Object.entries(STAGE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>
              <button type="submit" disabled={saving || !isDirty} className={`${buttonStyle} mt-5`}>{saving ? "Guardando..." : "Guardar cambios"}</button>
              <FeedbackMessage feedback={saveFeedback} />
            </form>
          </section>

          <section aria-labelledby="notes-title" className="border-t border-zinc-200 py-6">
            <h2 id="notes-title" className="text-lg font-semibold">Notas</h2>
            <div className="mt-5 max-w-3xl">
              {notes.status === "loading" && <p role="status" className="text-sm text-zinc-600">Cargando notas...</p>}
              {notes.status === "error" && <div><p role="alert" className="break-words text-sm text-rose-800">{notes.message}</p><button type="button" disabled={Boolean(noteOperation)} className={`${buttonStyle} mt-3`} onClick={() => {
                setNotes({ status: "loading" });
                setNotesAttempt((value) => value + 1);
              }}>Reintentar carga de notas</button></div>}
              {notes.status === "ready" && (notes.data.length === 0 ? <p className="text-sm text-zinc-500">Todavía no hay notas.</p> : (
                <ul className="divide-y divide-zinc-200">
                  {notes.data.map((note) => <li key={note.id} className="py-5 first:pt-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-zinc-500">{formatDate(note.created_at)}</p>
                      <button type="button" disabled={Boolean(noteOperation)} onClick={() => void removeNote(note.id)} className="rounded border border-rose-200 px-3 py-2 text-sm text-rose-800 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-800 disabled:opacity-50">{noteOperation?.kind === "delete" && noteOperation.id === note.id ? "Eliminando..." : "Eliminar nota"}</button>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 [overflow-wrap:anywhere]">{note.content}</p>
                  </li>)}
                </ul>
              ))}
              <form onSubmit={addNote} className="mt-6">
                <label className="block text-sm font-medium">Nueva nota
                  <textarea required rows={4} value={content} disabled={Boolean(noteOperation)} onChange={(event) => {
                    setContent(event.target.value);
                    setNoteFeedback({ status: "idle" });
                  }} className={`${controlStyle} resize-y`} />
                </label>
                <button type="submit" disabled={Boolean(noteOperation) || notes.status === "loading" || !content.trim()} className={`${buttonStyle} mt-3`}>{noteOperation?.kind === "create" ? "Guardando nota..." : "Añadir nota"}</button>
              </form>
              <FeedbackMessage feedback={noteFeedback} />
            </div>
          </section>
        </>
      )}
    </>
  );
}