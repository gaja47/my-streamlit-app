"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { mealDetail } from "@/lib/mockData";

export default function MealDetail() {
  const [servings, setServings] = useState(1);
  const m = mealDetail;
  const scale = (n: number) => Math.round(n * servings);

  return (
    <div>
      <Header title={m.title} subtitle={`${m.meal} · ${m.time}`} back="/meals" />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Per serving</div>
              <div className="text-[48px] font-light tracking-tightest tabular leading-none mt-2">
                {scale(m.kcal)}
              </div>
              <div className="text-[12px] text-bone-mute">kcal</div>
            </div>
            <div className="flex items-center gap-3 bg-ink-200 rounded-full p-1">
              <button onClick={() => setServings((s) => Math.max(0.5, s - 0.5))} className="w-9 h-9 rounded-full bg-ink-100 text-bone">−</button>
              <div className="tabular text-[14px] w-12 text-center">{servings} <span className="text-bone-mute">srv</span></div>
              <button onClick={() => setServings((s) => Math.min(8, s + 0.5))} className="w-9 h-9 rounded-full bg-bone text-ink">+</button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <MacroBar label="Protein" v={scale(m.protein)} unit="g" color="#95c9a6" pct={(m.protein * 4) / m.kcal * 100} kcal={scale(m.protein * 4)} />
            <MacroBar label="Carbs" v={scale(m.carbs)} unit="g" color="#e0a589" pct={(m.carbs * 4) / m.kcal * 100} kcal={scale(m.carbs * 4)} />
            <MacroBar label="Fat" v={scale(m.fat)} unit="g" color="#c98ba8" pct={(m.fat * 9) / m.kcal * 100} kcal={scale(m.fat * 9)} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-ink-300/60 text-[11px]">
            <Mini label="Fiber" v={scale(m.fiber)} unit="g" />
            <Mini label="Sugar" v={scale(m.sugar)} unit="g" />
            <Mini label="Sodium" v={scale(m.sodium)} unit="mg" />
          </div>

          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute mb-2">Micronutrients</div>
            <div className="flex flex-wrap gap-2">
              {m.micros.map((mi) => (
                <span key={mi.name} className="text-[11px] px-2.5 py-1 rounded-full border border-ink-300/60 bg-ink-100">
                  <span className="text-bone-mute mr-1">{mi.name}</span>
                  <span className="tabular">{mi.pct}%</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3">Ingredients</div>
          <div className="space-y-3">
            {m.ingredients.map((ing) => (
              <div key={ing.name} className="flex items-center justify-between text-[13px]">
                <div>
                  <div>{ing.name}</div>
                  <div className="text-[11px] text-bone-mute">{ing.qty}</div>
                </div>
                <div className="flex gap-3 text-[11px] tabular text-bone-mute">
                  <span>P{scale(ing.p)}</span><span>C{scale(ing.c)}</span><span>F{scale(ing.f)}</span>
                  <span className="text-bone tabular">{scale(ing.k)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3">Method</div>
          <ol className="space-y-3">
            {m.method.map((step, i) => (
              <li key={i} className="flex gap-3 text-[13px]">
                <span className="w-6 h-6 rounded-full bg-ink-100 border border-ink-300/60 text-[11px] tabular text-bone-mute flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <button className="rounded-2xl bg-ink-100 border border-ink-300/60 py-3 text-[13px]">Add reminder</button>
        <button className="rounded-2xl bg-bone text-ink py-3 text-[13px] font-medium">Log this serving</button>
      </div>
    </div>
  );
}

function MacroBar({ label, v, unit, color, pct, kcal }: { label: string; v: number; unit: string; color: string; pct: number; kcal: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className="text-bone-mute uppercase tracking-[0.2em] text-[10px]">{label}</span>
        </div>
        <div className="tabular">
          <span className="text-[15px] font-light">{v}</span>
          <span className="text-bone-mute ml-1 text-[11px]">{unit}</span>
          <span className="text-bone-mute ml-3 text-[11px]">{Math.round(pct)}% · {kcal} kcal</span>
        </div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-300/60 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
      </div>
    </div>
  );
}

function Mini({ label, v, unit }: { label: string; v: number; unit: string }) {
  return (
    <div>
      <div className="text-bone-mute uppercase tracking-[0.2em] text-[10px]">{label}</div>
      <div className="text-[14px] tabular mt-1">{v}<span className="text-bone-mute text-[10px] ml-1">{unit}</span></div>
    </div>
  );
}
