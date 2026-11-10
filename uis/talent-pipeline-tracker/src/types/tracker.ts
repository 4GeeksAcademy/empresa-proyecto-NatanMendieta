export const STATUS_LABELS = {
  received: "Recibida",
  in_progress: "En proceso",
  selected: "Seleccionada",
  discarded: "Descartada",
} as const;

export const STAGE_LABELS = {
  pending: "Pendiente de revisión",
  review: "En revisión",
  personal_interview: "Entrevista personal",
  technical_interview: "Entrevista técnica",
  offer_presented: "Oferta presentada",
} as const;

export type RecordStatus = keyof typeof STATUS_LABELS;
export type RecordStage = keyof typeof STAGE_LABELS;

export function getStatusLabel(value: string): string {
  return Object.hasOwn(STATUS_LABELS, value)
    ? STATUS_LABELS[value as RecordStatus]
    : "Estado desconocido";
}

export function getStageLabel(value: string): string {
  return Object.hasOwn(STAGE_LABELS, value)
    ? STAGE_LABELS[value as RecordStage]
    : "Etapa desconocida";
}

export interface RecordForm {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  linkedin_url?: string | null;
  cv_url?: string | null;
}

export type CreateRecordInput = RecordForm;
export type ReplaceRecordInput = RecordForm;

export interface PatchRecordInput {
  status?: RecordStatus;
  stage?: RecordStage;
}

export interface TrackerRecord extends RecordForm {
  id: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: string;
  stage: string;
  notes_count: number;
  applied_at: string;
  updated_at: string;
}

export interface TrackerNote {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface NoteForm {
  content: string;
}

export interface RecordFilters {
  status?: RecordStatus;
  stage?: RecordStage;
  search?: string;
}

export interface RecordListParams extends RecordFilters {
  page?: number;
  limit?: number;
}

export interface RecordListResponse {
  total: number;
  page: number;
  limit: number;
  data: TrackerRecord[];
}

export interface NoteListResponse {
  data: TrackerNote[];
  meta: Record<string, unknown>;
}