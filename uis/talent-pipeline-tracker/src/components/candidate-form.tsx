"use client";

import { useId, useState, type FormEvent } from "react";
import { createRecord, replaceRecord } from "@/lib/api";
import type { RecordForm, TrackerRecord } from "@/types/tracker";

type FormValues = { [Field in keyof Required<RecordForm>]: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;
type Feedback = { status: "idle" } | { status: "pending" | "success" | "error"; message: string };

interface CandidateFormProps {
  record?: TrackerRecord;
  onSaved: (record: TrackerRecord) => void;
}

const emptyValues: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  experience_years: "",
  linkedin_url: "",
  cv_url: "",
};

const fields = [
  { name: "full_name", label: "Nombre completo", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel", required: true },
  { name: "position", label: "Puesto", type: "text", autoComplete: "off", required: true },
  { name: "experience_years", label: "Años de experiencia", type: "number", autoComplete: "off", required: true },
  { name: "linkedin_url", label: "LinkedIn (opcional)", type: "url", autoComplete: "off", required: false },
  { name: "cv_url", label: "CV (opcional)", type: "url", autoComplete: "off", required: false },
] as const;

export function CandidateForm({ record, onSaved }: CandidateFormProps) {
  const formId = useId();
  const [values, setValues] = useState<FormValues>(() => record ? {
    full_name: record.full_name,
    email: record.email,
    phone: record.phone,
    position: record.position,
    experience_years: String(record.experience_years),
    linkedin_url: record.linkedin_url ?? "",
    cv_url: record.cv_url ?? "",
  } : { ...emptyValues });
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<Feedback>({ status: "idle" });
  const saving = feedback.status === "pending";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    const nextErrors: FormErrors = {};
    for (const field of fields) {
      const value = values[field.name].trim();
      const input = form.elements.namedItem(field.name) as HTMLInputElement;
      if (field.required && !value) {
        nextErrors[field.name] = "Este campo es obligatorio.";
      } else if (field.type === "email" && input.validity.typeMismatch) {
        nextErrors[field.name] = "Introduce un email válido.";
      } else if (field.type === "number" && (input.validity.badInput || !Number.isFinite(Number(value)) || Number(value) < 0)) {
        nextErrors[field.name] = "Introduce un número mayor o igual que cero.";
      } else if (field.type === "url" && value) {
        try {
          const url = new URL(value);
          if (!["https:", "http:"].includes(url.protocol)) throw new Error("Invalid protocol");
        } catch {
          nextErrors[field.name] = "Introduce una URL válida con http:// o https://.";
        }
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFeedback({ status: "error", message: "Revisa los campos indicados antes de guardar." });
      const firstInvalid = form.elements.namedItem(Object.keys(nextErrors)[0]) as HTMLInputElement;
      firstInvalid.focus();
      return;
    }

    const input: RecordForm = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      experience_years: Number(values.experience_years),
      linkedin_url: values.linkedin_url.trim() || null,
      cv_url: values.cv_url.trim() || null,
    };
    setFeedback({ status: "pending", message: record ? "Guardando candidatura..." : "Creando candidatura..." });
    try {
      const saved = record ? await replaceRecord(record.id, input) : await createRecord(input);
      onSaved(saved);
      if (!record) setValues({ ...emptyValues });
      setFeedback({ status: "success", message: record ? "Candidatura actualizada." : "Candidatura creada." });
    } catch (error) {
      setFeedback({ status: "error", message: error instanceof Error ? error.message : "No se pudo guardar la candidatura." });
    }
  }

  return (
    <form noValidate onSubmit={submit} aria-busy={saving} className="mt-5 max-w-3xl">
      <fieldset disabled={saving} className="grid min-w-0 gap-5 sm:grid-cols-2">
        <legend className="sr-only">{record ? "Editar candidatura" : "Nueva candidatura"}</legend>
        {fields.map((field) => {
          const id = `${formId}-${field.name}`;
          return (
            <div key={field.name} className="min-w-0">
              <label htmlFor={id} className="text-sm font-medium">{field.label}</label>
              <input
                id={id}
                name={field.name}
                type={field.type}
                required={field.required}
                autoComplete={field.autoComplete}
                min={field.type === "number" ? 0 : undefined}
                step={field.type === "number" ? "any" : undefined}
                value={values[field.name]}
                onChange={(event) => {
                  setValues((current) => ({ ...current, [field.name]: event.target.value }));
                  setErrors((current) => ({ ...current, [field.name]: undefined }));
                  setFeedback({ status: "idle" });
                }}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? `${id}-error` : undefined}
                className="mt-2 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 disabled:bg-zinc-100 aria-invalid:border-rose-700"
              />
              {errors[field.name] && <p id={`${id}-error`} className="mt-2 text-sm text-rose-800">{errors[field.name]}</p>}
            </div>
          );
        })}
      </fieldset>
      <button type="submit" disabled={saving} className="mt-5 rounded-md bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
        {saving ? "Guardando..." : record ? "Guardar candidatura" : "Crear candidatura"}
      </button>
      {feedback.status !== "idle" && <p role={feedback.status === "error" ? "alert" : "status"} className={`mt-3 break-words text-sm ${feedback.status === "error" ? "text-rose-800" : feedback.status === "success" ? "text-emerald-800" : "text-zinc-600"}`}>{feedback.message}</p>}
    </form>
  );
}