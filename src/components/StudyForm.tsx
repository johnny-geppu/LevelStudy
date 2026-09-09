"use client";

import { useActionState, useRef } from "react";
import { saveStudy } from "@/lib/actions/study";

export function StudyForm({ operation, skillId, recordId, children, label, confirm, reset = false }: {
  operation: string; skillId?: string; recordId?: string; children?: React.ReactNode;
  label: string; confirm?: string; reset?: boolean;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (previous: { error?: string; success?: string }, form: FormData) => {
    const result = await saveStudy(previous, form);
    if (result.success && reset) ref.current?.reset();
    return result;
  }, {});
  return <form ref={ref} action={action} className="study-form" onSubmit={event => {
    if (confirm && !window.confirm(confirm)) event.preventDefault();
  }}>
    <input type="hidden" name="operation" value={operation} />
    {skillId && <input type="hidden" name="skillId" value={skillId} />}
    {recordId && <input type="hidden" name="recordId" value={recordId} />}
    <fieldset disabled={pending} className="space-y-4">{children}<button className={operation === "deleteRecord" ? "btn-danger" : "btn-primary"} disabled={pending}>{pending ? "保存中…" : label}</button></fieldset>
    {state.error && <p role="alert" className="mt-3 text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="mt-3 text-sm text-emerald-700">{state.success}</p>}
  </form>;
}

export function RecordFields({ today, record }: { today: string; record?: { content: string; minutes: number; date: string } }) {
  return <>
    <div className="grid grid-cols-2 gap-3">
      <label>学習日<input aria-label="学習日" type="date" name="date" min="2000-01-01" max={today} defaultValue={record?.date ?? today} required /></label>
      <label>学習時間（分）<input type="number" name="minutes" min="1" max="1440" step="1" defaultValue={record?.minutes ?? 30} required /></label>
    </div>
    <label className="block">学習したこと<textarea name="content" rows={3} maxLength={1000} defaultValue={record?.content} placeholder="今日は何を学びましたか？" required /></label>
  </>;
}
