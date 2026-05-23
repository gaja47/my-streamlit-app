"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { exercises } from "@/lib/exercises";

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const e = exercises[id];

  if (!e) {
    return (
      <div>
        <Header title="Not found" back="/exercises" />
        <div className="px-5 text-[12px]" style={{ color: "var(--text-mute)" }}>Exercise not in the library.</div>
      </div>
    );
  }

  return (
    <div>
      <Header title={e.name} subtitle={e.category} back="/exercises" />

      <div className="px-5 mt-2 space-y-4">
        <div className="card p-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary" value={e.primary.join(", ")} />
            <Field label="Secondary" value={e.secondary.length ? e.secondary.join(", ") : "-"} />
            <Field label="Equipment" value={e.equipment.join(", ")} />
            <Field label="Default reps" value={e.defaultReps} />
          </div>
        </div>

        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "var(--text-mute)" }}>Form cues</div>
          <ol className="space-y-3">
            {e.cues.map((c, i) => (
              <li key={i} className="flex gap-3 text-[13px]">
                <span className="w-6 h-6 rounded-full text-[11px] tabular flex items-center justify-center shrink-0 border" style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text-mute)" }}>{i + 1}</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-mute)" }}>{label}</div>
      <div className="text-[14px] mt-1">{value}</div>
    </div>
  );
}
