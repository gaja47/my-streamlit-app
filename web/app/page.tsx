import Link from "next/link";
import Header from "@/components/Header";
import { NestedRings, Ring } from "@/components/Ring";
import { HeartRateChart } from "@/components/Charts";
import { activity, consumed, hrSeries, meals, readiness, targets, user } from "@/lib/mockData";

export default function Home() {
  const movePct = (activity.moveCalories / activity.moveTarget) * 100;
  const exPct = (activity.exerciseMin / activity.exerciseTarget) * 100;
  const standPct = (activity.standHours / activity.standTarget) * 100;
  const calPct = (consumed.calories / targets.calories) * 100;

  return (
    <div>
      <Header
        title={`Good morning, ${user.name}`}
        subtitle={`Mon · 15 May · Day ${user.day} of ${user.totalDays}`}
        right={
          <Link href="/reminders" className="w-10 h-10 rounded-full bg-ink-100 border border-ink-300/60 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5f5f0" strokeWidth="1.6"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 21a2 2 0 0 0 4 0" strokeLinecap="round"/></svg>
          </Link>
        }
      />

      {/* Readiness hero */}
      <div className="px-5 mt-3">
        <div className="card p-5 flex items-center gap-5">
          <div className="relative">
            <Ring size={132} stroke={10} value={readiness.score} color="#95c9a6" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Readiness</div>
              <div className="text-[44px] font-light tracking-tightest leading-none mt-1">{readiness.score}</div>
              <div className="text-[10px] text-bone-mute mt-1">optimal</div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-y-3 text-[13px]">
            <Stat label="HRV" value={`${readiness.hrv}`} unit="ms" />
            <Stat label="RHR" value={`${readiness.rhr}`} unit="bpm" />
            <Stat label="Sleep" value={`${readiness.sleepHours}`} unit="h" />
            <Stat label="SpO₂" value={`${readiness.spo2}`} unit="%" />
          </div>
        </div>
      </div>

      {/* Activity rings */}
      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Activity</div>
              <div className="text-[26px] font-light tracking-tightest mt-1">
                {activity.moveCalories}
                <span className="text-bone-mute text-base"> / {activity.moveTarget} cal</span>
              </div>
            </div>
            <NestedRings
              values={[
                { value: movePct, color: "#e0a589" },
                { value: exPct, color: "#c98ba8" },
                { value: standPct, color: "#95c9a6" },
              ]}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <Legend dot="#e0a589" label="Move" value={`${activity.moveCalories} cal`} />
            <Legend dot="#c98ba8" label="Exercise" value={`${activity.exerciseMin} min`} />
            <Legend dot="#95c9a6" label="Stand" value={`${activity.standHours} h`} />
          </div>
        </div>
      </div>

      {/* Heart rate */}
      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Heart rate</div>
              <div className="text-[26px] font-light tracking-tightest mt-1">
                72<span className="text-bone-mute text-base"> bpm · resting</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-bone-mute">
              <div>Peak <span className="text-bone">162</span></div>
              <div>Min <span className="text-bone">54</span></div>
            </div>
          </div>
          <HeartRateChart values={hrSeries} />
          <div className="flex justify-between text-[10px] text-bone-mute mt-1">
            <span>00</span><span>06</span><span>12</span><span>18</span><span>now</span>
          </div>
        </div>
      </div>

      {/* Nutrition */}
      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Nutrition</div>
              <div className="text-[26px] font-light tracking-tightest mt-1">
                {consumed.calories}<span className="text-bone-mute text-base"> / {targets.calories} kcal</span>
              </div>
            </div>
            <Link href="/meals" className="text-[12px] text-bone-dim underline underline-offset-4 decoration-bone-mute/40">View meals</Link>
          </div>
          <Bar value={calPct} color="#e0a589" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Macro label="Protein" v={consumed.protein} t={targets.protein} unit="g" color="#95c9a6" />
            <Macro label="Carbs" v={consumed.carbs} t={targets.carbs} unit="g" color="#e0a589" />
            <Macro label="Fat" v={consumed.fat} t={targets.fat} unit="g" color="#c98ba8" />
          </div>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3">Today</div>
          <div className="space-y-3">
            {meals.slice(0, 4).map((m) => (
              <Link key={m.id} href={`/meals/${m.id === "breakfast" ? "breakfast" : "breakfast"}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-bone-mute tabular w-12 text-[12px]">{m.time}</div>
                  <div>
                    <div className="text-[14px]">{m.title}</div>
                    <div className="text-[11px] text-bone-mute">{m.name} · P{m.protein} C{m.carbs} F{m.fat}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[12px] tabular text-bone-dim">{m.kcal}</div>
                  <StatusDot status={m.status} />
                </div>
              </Link>
            ))}
            <Link href="/workout" className="flex items-center justify-between border-t border-ink-200/60 pt-3">
              <div className="flex items-center gap-3">
                <div className="text-bone-mute tabular w-12 text-[12px]">18:00</div>
                <div>
                  <div className="text-[14px]">Push Day</div>
                  <div className="text-[11px] text-bone-mute">Strength · ~50 min · 6 lifts</div>
                </div>
              </div>
              <div className="text-[12px] tabular text-bone-dim">start</div>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 mb-4">
        <Link href="/onboarding" className="text-[12px] text-bone-mute underline underline-offset-4 decoration-bone-mute/40">
          Need to update your profile? Re-run onboarding →
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
      <div className="text-[20px] font-light tracking-tightest mt-0.5 tabular">
        {value}<span className="text-bone-mute text-[12px] ml-1">{unit}</span>
      </div>
    </div>
  );
}

function Legend({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      <span className="text-bone-mute">{label}</span>
      <span className="tabular text-bone ml-auto">{value}</span>
    </div>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-ink-300/60 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </div>
  );
}

function Macro({ label, v, t, unit, color }: { label: string; v: number; t: number; unit: string; color: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
      <div className="text-[18px] font-light tracking-tightest tabular mt-1">{v}<span className="text-bone-mute text-[11px]"> / {t}{unit}</span></div>
      <div className="mt-2"><Bar value={(v / t) * 100} color={color} /></div>
    </div>
  );
}

function StatusDot({ status }: { status: "logged" | "upcoming" | "now" }) {
  const color = status === "logged" ? "#95c9a6" : status === "now" ? "#e0a589" : "#3a3a44";
  return <span className="w-2 h-2 rounded-full" style={{ background: color }} />;
}
