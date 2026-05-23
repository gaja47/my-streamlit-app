"use client";
import Link from "next/link";
import Header from "@/components/Header";
import { actions, totals, useHydrate, useStore } from "@/lib/store";

export default function Meals() {
  useHydrate();
  const targets = useStore((s) => s.targets);
  const meals = useStore((s) => s.today.meals);
  const consumed = useStore(totals);

  const remaining = {
    cal: Math.max(0, targets.calories - consumed.calories),
    p: Math.max(0, targets.protein - consumed.protein),
    c: Math.max(0, targets.carbs - consumed.carbs),
    f: Math.max(0, targets.fat - consumed.fat),
  };

  return (
    <div>
      <Header title="Eat" subtitle={new Date().toDateString()} />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Remaining today</div>
          <div className="text-[40px] font-light tracking-tightest tabular mt-2">
            {Math.round(remaining.cal)}<span className="text-bone-mute text-base"> kcal</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-[12px]">
            <Remain label="Protein" v={Math.round(remaining.p)} unit="g" color="#95c9a6" />
            <Remain label="Carbs" v={Math.round(remaining.c)} unit="g" color="#e0a589" />
            <Remain label="Fat" v={Math.round(remaining.f)} unit="g" color="#c98ba8" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute px-1 mb-3">Today's plan</div>
        <div className="space-y-2.5">
          {meals.map((m) => {
            const logged = m.loggedAt !== null;
            return (
              <div key={m.id} className="subcard p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/meals/${m.id}`} className="flex items-center gap-3 flex-1">
                    <div className="tabular text-bone-mute w-12 text-[12px]">{m.time}</div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{m.name}</div>
                      <div className="text-[15px] mt-0.5">{m.title}</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => actions.toggleMealLogged(m.id)}
                    aria-label={logged ? "Unlog" : "Log"}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center ml-2 ${
                      logged ? "bg-readiness border-readiness text-ink" : "border-ink-300/60 bg-ink-100 text-bone-mute"
                    }`}
                  >
                    {logged ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-300/60">
                  <div className="flex gap-4 text-[11px] tabular">
                    <span><span className="text-bone-mute">P</span> {Math.round(m.protein * m.servings)}</span>
                    <span><span className="text-bone-mute">C</span> {Math.round(m.carbs * m.servings)}</span>
                    <span><span className="text-bone-mute">F</span> {Math.round(m.fat * m.servings)}</span>
                  </div>
                  <div className="text-[11px] tabular">
                    <span className={logged ? "text-readiness" : "text-bone-mute"}>
                      {Math.round(m.kcal * m.servings)} kcal
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Link href="/meals/breakfast" className="rounded-2xl bg-ink-100 border border-ink-300/60 py-3 text-[13px] text-center">Open breakfast</Link>
        <button
          onClick={() => meals.filter((m) => !m.loggedAt).forEach((m) => actions.toggleMealLogged(m.id))}
          className="rounded-2xl bg-bone text-ink py-3 text-[13px] font-medium"
        >
          Log all remaining
        </button>
      </div>
    </div>
  );
}

function Remain({ label, v, unit, color }: { label: string; v: number; unit: string; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
      </div>
      <div className="text-[18px] tabular font-light tracking-tightest mt-1">
        {v}<span className="text-bone-mute text-[10px] ml-1">{unit}</span>
      </div>
    </div>
  );
}
