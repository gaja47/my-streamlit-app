"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { exerciseList, type Exercise } from "@/lib/exercises";

const CATEGORIES: Exercise["category"][] = ["push", "pull", "legs", "core", "cardio", "mobility"];

export default function Exercises() {
  const [filter, setFilter] = useState<Exercise["category"] | "all">("all");
  const [q, setQ] = useState("");

  const list = exerciseList.filter((e) => {
    if (filter !== "all" && e.category !== filter) return false;
    if (q && !`${e.name} ${e.primary.join(" ")} ${e.secondary.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <Header title="Exercise library" subtitle={`${list.length} exercises`} back="/profile" />

      <div className="px-5 mt-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search exercises..."
          className="w-full bg-transparent border rounded-xl px-4 py-3 text-[14px] outline-none"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      <div className="px-5 mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <Chip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />
        ))}
      </div>

      <div className="px-5 mt-4 space-y-2">
        {list.map((e) => (
          <Link key={e.id} href={`/exercises/${e.id}`} className="block subcard p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-mute)" }}>{e.category}</div>
                <div className="text-[14px] mt-0.5">{e.name}</div>
              </div>
              <div className="text-[11px] tabular" style={{ color: "var(--text-mute)" }}>{e.defaultReps}</div>
            </div>
            <div className="text-[11px] mt-2" style={{ color: "var(--text-mute)" }}>
              {e.primary.join(", ")}{e.secondary.length ? ` · ${e.secondary.join(", ")}` : ""}
            </div>
          </Link>
        ))}
        {list.length === 0 && <div className="text-[12px] text-center py-8" style={{ color: "var(--text-mute)" }}>No matches</div>}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.15em] border whitespace-nowrap"
      style={{
        background: active ? "var(--text)" : "var(--surface-2)",
        color: active ? "var(--bg)" : "var(--text-mute)",
        borderColor: active ? "var(--text)" : "var(--border)",
      }}
    >
      {label}
    </button>
  );
}
