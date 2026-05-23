"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { mealPlans } from "@/lib/mealPlans";
import { getRecipe } from "@/lib/recipes";
import { actions, useHydrate, useStore } from "@/lib/store";

export default function PlanDetail() {
  useHydrate();
  const { id } = useParams<{ id: string }>();
  const p = mealPlans[id] ?? mealPlans.recomp_2700;
  const selected = useStore((s) => s.selectedPlanId);
  const isSelected = selected === p.id;

  return (
    <div>
      <Header title={p.name} subtitle={`${p.targetCal} kcal target`} back="/plans" />

      <div className="px-5 mt-2 space-y-4">
        <div className="card p-5">
          <div className="text-[12px] leading-relaxed" style={{ color: "var(--text-mute)" }}>{p.description}</div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            <Macro label="kcal" v={p.targetCal} />
            <Macro label="P" v={p.targetProtein} unit="g" />
            <Macro label="C" v={p.targetCarbs} unit="g" />
            <Macro label="F" v={p.targetFat} unit="g" />
          </div>
          <button
            onClick={() => actions.setSelectedPlan(isSelected ? null : p.id)}
            className="mt-4 w-full rounded-2xl py-3 text-[13px] font-medium"
            style={{ background: isSelected ? "var(--surface-3)" : "var(--text)", color: isSelected ? "var(--text)" : "var(--bg)" }}
          >
            {isSelected ? "Following - tap to unfollow" : "Follow this plan"}
          </button>
        </div>

        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "var(--text-mute)" }}>Today's meals</div>
          <div className="space-y-2">
            {p.meals.map((m, i) => {
              const r = getRecipe(m.recipeId);
              return (
                <Link key={i} href={`/meals/${m.recipeId}`} className="subcard p-3.5 block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="tabular w-12 text-[12px]" style={{ color: "var(--text-mute)" }}>{m.time}</div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-mute)" }}>{m.meal}</div>
                        <div className="text-[14px] mt-0.5">{r.title}</div>
                      </div>
                    </div>
                    <div className="text-[12px] tabular" style={{ color: "var(--text-mute)" }}>{Math.round(r.kcal * m.servings)} kcal</div>
                  </div>
                  <div className="flex justify-between text-[10px] tabular mt-2 pt-2 border-t" style={{ borderColor: "var(--border)", color: "var(--text-mute)" }}>
                    <span>P {Math.round(r.protein * m.servings)}</span>
                    <span>C {Math.round(r.carbs * m.servings)}</span>
                    <span>F {Math.round(r.fat * m.servings)}</span>
                    {m.servings !== 1 && <span>x{m.servings} srv</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Macro({ label, v, unit }: { label: string; v: number; unit?: string }) {
  return (
    <div className="rounded-2xl py-2.5 border text-center" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
      <div className="text-[16px] tabular font-light tracking-tightest">{v}{unit && <span className="text-[10px] ml-0.5" style={{ color: "var(--text-mute)" }}>{unit}</span>}</div>
      <div className="text-[9px] uppercase tracking-[0.2em] mt-0.5" style={{ color: "var(--text-mute)" }}>{label}</div>
    </div>
  );
}
