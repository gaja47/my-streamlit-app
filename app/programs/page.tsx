"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { programList } from "@/lib/programs";
import { actions, useHydrate, useStore } from "@/lib/store";

export default function Programs() {
  useHydrate();
  const selected = useStore((s) => s.selectedProgramId);

  return (
    <div>
      <Header title="Workout programs" subtitle="Pick a plan to follow" back="/profile" />

      <div className="px-5 mt-2">
        <div className="text-[11px] leading-relaxed mb-3 px-1" style={{ color: "var(--text-mute)" }}>
          All programs are evidence-based. Strength programs prioritize heavy compounds; hypertrophy programs use higher volume in moderate rep ranges. Pick by goal and how many days you can train.
        </div>
        <div className="space-y-3">
          {programList.map((p) => {
            const isSelected = selected === p.id;
            return (
              <div key={p.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-mute)" }}>{p.goal.replace("_", " ")}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-mute)" }}>· {p.level}</span>
                    </div>
                    <div className="text-[18px] mt-1">{p.name}</div>
                    <div className="text-[11px] mt-1" style={{ color: "var(--text-mute)" }}>{p.daysPerWeek}x/wk · {p.durationWeeks} weeks</div>
                  </div>
                  {isSelected && <div className="text-[10px] px-2 py-1 rounded-full" style={{ background: "var(--accent-readiness)", color: "var(--bg)" }}>Following</div>}
                </div>
                <div className="text-[12px] mt-3 leading-relaxed" style={{ color: "var(--text-mute)" }}>{p.description}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.bestFor.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-1 rounded-full border" style={{ borderColor: "var(--border)", color: "var(--text-mute)" }}>{t}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Link href={`/programs/${p.id}`} className="rounded-xl py-2.5 text-center text-[12px] border" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>View detail</Link>
                  <button
                    onClick={() => actions.setSelectedProgram(isSelected ? null : p.id)}
                    className="rounded-xl py-2.5 text-[12px] font-medium"
                    style={{ background: isSelected ? "var(--surface-3)" : "var(--text)", color: isSelected ? "var(--text)" : "var(--bg)" }}
                  >
                    {isSelected ? "Unselect" : "Follow this"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
