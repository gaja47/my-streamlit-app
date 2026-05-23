"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { mealPlanList } from "@/lib/mealPlans";
import { actions, useHydrate, useStore } from "@/lib/store";

export default function Plans() {
  useHydrate();
  const selected = useStore((s) => s.selectedPlanId);

  return (
    <div>
      <Header title="Meal plans" subtitle="Pick a calorie target" back="/profile" />

      <div className="px-5 mt-2">
        <div className="text-[11px] leading-relaxed mb-3 px-1" style={{ color: "var(--text-mute)" }}>
          Each plan is built around your goal with high-protein meals timed across the day. Calories are guidelines - adjust by 100-200 kcal up or down based on your weekly weight trend.
        </div>
        <div className="space-y-3">
          {mealPlanList.map((p) => {
            const isSelected = selected === p.id;
            return (
              <div key={p.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-mute)" }}>{p.goal.replace("_", " ")}</div>
                    <div className="text-[18px] mt-1">{p.name}</div>
                  </div>
                  {isSelected && <div className="text-[10px] px-2 py-1 rounded-full" style={{ background: "var(--accent-readiness)", color: "var(--bg)" }}>Following</div>}
                </div>
                <div className="text-[12px] mt-3 leading-relaxed" style={{ color: "var(--text-mute)" }}>{p.description}</div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  <Macro label="kcal" v={p.targetCal} />
                  <Macro label="P (g)" v={p.targetProtein} />
                  <Macro label="C (g)" v={p.targetCarbs} />
                  <Macro label="F (g)" v={p.targetFat} />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Link href={`/plans/${p.id}`} className="rounded-xl py-2.5 text-center text-[12px] border" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>View detail</Link>
                  <button
                    onClick={() => actions.setSelectedPlan(isSelected ? null : p.id)}
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

function Macro({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-2xl py-2.5 border text-center" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
      <div className="text-[14px] tabular font-light tracking-tightest">{v}</div>
      <div className="text-[9px] uppercase tracking-[0.2em] mt-0.5" style={{ color: "var(--text-mute)" }}>{label}</div>
    </div>
  );
}
