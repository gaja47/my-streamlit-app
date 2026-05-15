import Link from "next/link";
import Header from "@/components/Header";
import { consumed, meals, targets } from "@/lib/mockData";

export default function Meals() {
  const remaining = {
    cal: targets.calories - consumed.calories,
    p: targets.protein - consumed.protein,
    c: targets.carbs - consumed.carbs,
    f: targets.fat - consumed.fat,
  };
  return (
    <div>
      <Header title="Eat" subtitle="Mon · 15 May" />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Remaining today</div>
          <div className="text-[40px] font-light tracking-tightest tabular mt-2">
            {remaining.cal}<span className="text-bone-mute text-base"> kcal</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-[12px]">
            <Remain label="Protein" v={remaining.p} unit="g" color="#95c9a6" />
            <Remain label="Carbs" v={remaining.c} unit="g" color="#e0a589" />
            <Remain label="Fat" v={remaining.f} unit="g" color="#c98ba8" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute px-1 mb-3">Today's plan</div>
        <div className="space-y-2.5">
          {meals.map((m) => (
            <Link key={m.id} href={`/meals/breakfast`} className="block subcard p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="tabular text-bone-mute w-12 text-[12px]">{m.time}</div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{m.name}</div>
                    <div className="text-[15px] mt-0.5">{m.title}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] tabular font-light tracking-tightest">{m.kcal}</div>
                  <div className="text-[10px] text-bone-mute">kcal</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-300/60">
                <div className="flex gap-4 text-[11px] tabular">
                  <span><span className="text-bone-mute">P</span> {m.protein}</span>
                  <span><span className="text-bone-mute">C</span> {m.carbs}</span>
                  <span><span className="text-bone-mute">F</span> {m.fat}</span>
                </div>
                <div className="text-[11px] tabular text-bone-mute">
                  {m.status === "logged" && <span className="text-readiness">Logged ✓</span>}
                  {m.status === "now" && <span className="text-activity">In {m.eta}</span>}
                  {m.status === "upcoming" && <span>In {m.eta}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <button className="rounded-2xl bg-ink-100 border border-ink-300/60 py-3 text-[13px]">Swap a meal</button>
        <button className="rounded-2xl bg-bone text-ink py-3 text-[13px] font-medium">Add snack</button>
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
