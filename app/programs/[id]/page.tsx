"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { programs } from "@/lib/programs";
import { exercises } from "@/lib/exercises";
import { actions, useHydrate, useStore } from "@/lib/store";

export default function ProgramDetail() {
  useHydrate();
  const { id } = useParams<{ id: string }>();
  const program = programs[id] ?? programs.full_body;
  const selected = useStore((s) => s.selectedProgramId);
  const isSelected = selected === program.id;

  return (
    <div>
      <Header title={program.name} subtitle={`${program.daysPerWeek}x/wk - ${program.level}`} back="/programs" />

      <div className="px-5 mt-2 space-y-4">
        <div className="card p-5">
          <div className="text-[12px] leading-relaxed" style={{ color: "var(--text-mute)" }}>{program.description}</div>
          <button
            onClick={() => actions.setSelectedProgram(isSelected ? null : program.id)}
            className="mt-4 w-full rounded-2xl py-3 text-[13px] font-medium"
            style={{ background: isSelected ? "var(--surface-3)" : "var(--text)", color: isSelected ? "var(--text)" : "var(--bg)" }}
          >
            {isSelected ? "Following - tap to unfollow" : "Follow this program"}
          </button>
        </div>

        {program.days.map((d, i) => (
          <div key={i} className="card p-5">
            <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-mute)" }}>{d.label}</div>
            <div className="text-[12px] mt-1" style={{ color: "var(--text-mute)" }}>{d.focus}</div>
            <div className="mt-4 space-y-2">
              {d.exercises.map((e, j) => {
                const ex = exercises[e.exerciseId];
                return (
                  <Link key={j} href={`/exercises/${e.exerciseId}`} className="block subcard p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[14px]">{ex?.name ?? e.exerciseId}</div>
                      <div className="text-[11px] tabular" style={{ color: "var(--text-mute)" }}>
                        {e.sets} x {e.reps}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px]" style={{ color: "var(--text-mute)" }}>
                      <span>Rest {e.rest}</span>
                      {e.notes && <span className="italic">{e.notes}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
