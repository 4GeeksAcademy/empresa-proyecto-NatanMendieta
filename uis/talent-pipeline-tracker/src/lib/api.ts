import type {
  CreateRecordInput,
  NoteForm,
  NoteListResponse,
  PatchRecordInput,
  RecordFilters,
  RecordListParams,
  RecordListResponse,
  ReplaceRecordInput,
  TrackerNote,
  TrackerRecord,
} from "../types/tracker";

export type ApiErrorKind = "configuration" | "network" | "http" | "json" | "response";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly kind: ApiErrorKind,
    public readonly status?: number,
    public readonly details?: unknown,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ApiError";
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    for (const key of ["error", "message", "detail"]) {
      const value = (body as Record<string, unknown>)[key];
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  return fallback;
}

async function request(path: string, init: RequestInit = {}): Promise<unknown> {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
  if (!base) {
    throw new ApiError("Falta configurar NEXT_PUBLIC_API_URL.", "configuration");
  }

  let response: Response;
  let text: string;
  try {
    response = await fetch(`${base}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
    text = response.status === 204 ? "" : await response.text();
  } catch (cause) {
    throw new ApiError("No se pudo completar la conexión con la API.", "network", undefined, undefined, { cause });
  }

  let body: unknown;
  let parseError: unknown;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch (cause) {
      parseError = cause;
      body = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      errorMessage(body, `Error HTTP ${response.status}: ${response.statusText}`),
      "http",
      response.status,
      body,
      parseError ? { cause: parseError } : undefined,
    );
  }
  if (response.status === 204) return undefined;
  if (!text || parseError) {
    throw new ApiError("La API devolvió una respuesta JSON no válida.", "json", response.status, text, { cause: parseError });
  }
  return body;
}

async function requestJson<Result>(path: string, init?: RequestInit): Promise<Result> {
  const body = await request(path, init);
  if (body === undefined || body === null) {
    throw new ApiError("La API no devolvió los datos esperados.", "response");
  }
  return body as Result;
}

function recordPath(id: string): string {
  return `/records/${encodeURIComponent(id)}`;
}

function positiveInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`${name} debe ser un entero positivo.`);
  }
}

export async function getRecordsPage(
  params: RecordListParams = {},
  signal?: AbortSignal,
): Promise<RecordListResponse> {
  const { page = 1, limit = 20, status, stage, search } = params;
  positiveInteger(page, "page");
  positiveInteger(limit, "limit");
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) query.set("status", status);
  if (stage) query.set("stage", stage);
  if (search) query.set("search", search);
  const result = await requestJson<RecordListResponse>(`/records?${query}`, { signal });
  if (!Number.isSafeInteger(result.total) || result.total < 0 || result.page !== page ||
      !Number.isSafeInteger(result.limit) || result.limit < 1 || !Array.isArray(result.data)) {
    throw new ApiError("La paginación recibida no es válida.", "response", undefined, result);
  }
  return {
    ...result,
    data: result.data.map((record) => ({
      id: record.id,
      full_name: record.full_name,
      email: record.email,
      phone: record.phone,
      position: record.position,
      experience_years: record.experience_years,
      linkedin_url: record.linkedin_url,
      cv_url: record.cv_url,
      status: record.status,
      stage: record.stage,
      notes_count: record.notes_count,
      applied_at: record.applied_at,
      updated_at: record.updated_at,
    })),
  };
}

export async function getRecords(
  params: RecordFilters & { limit?: number } = {},
  signal?: AbortSignal,
): Promise<TrackerRecord[]> {
  const records = new Map<string, TrackerRecord>();
  let page = 1;
  while (true) {
    const result = await getRecordsPage({ ...params, page }, signal);
    const previousSize = records.size;
    for (const record of result.data) records.set(record.id, record);
    if (records.size >= result.total) return [...records.values()];
    if (records.size === previousSize) {
      throw new ApiError("La paginación no permite recuperar el total de candidaturas.", "response", undefined, {
        page, total: result.total, received: records.size,
      });
    }
    page += 1;
  }
}

export async function getRecord(id: string, signal?: AbortSignal): Promise<TrackerRecord> {
  return await requestJson<TrackerRecord>(recordPath(id), { signal });
}

export async function createRecord(input: CreateRecordInput): Promise<TrackerRecord> {
  return await requestJson<TrackerRecord>("/records", { method: "POST", body: JSON.stringify(input) });
}

export async function replaceRecord(id: string, input: ReplaceRecordInput): Promise<TrackerRecord> {
  return await requestJson<TrackerRecord>(recordPath(id), { method: "PUT", body: JSON.stringify(input) });
}

export async function patchRecord(id: string, input: PatchRecordInput): Promise<TrackerRecord> {
  return await requestJson<TrackerRecord>(recordPath(id), { method: "PATCH", body: JSON.stringify(input) });
}

export async function getNotes(id: string, signal?: AbortSignal): Promise<NoteListResponse> {
  return await requestJson<NoteListResponse>(`${recordPath(id)}/notes`, { signal });
}

export async function createNote(id: string, input: NoteForm): Promise<TrackerNote> {
  return await requestJson<TrackerNote>(`${recordPath(id)}/notes`, { method: "POST", body: JSON.stringify(input) });
}

export async function deleteNote(id: string, noteId: string): Promise<void> {
  await request(`${recordPath(id)}/notes/${encodeURIComponent(noteId)}`, { method: "DELETE" });
}