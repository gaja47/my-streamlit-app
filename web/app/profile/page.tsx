import Link from "next/link";
import Header from "@/components/Header";

const rows = [
  { href: "/onboarding", label: "Physique profile", note: "Recomp · 178 cm · 76.4 kg · 14%" },
  { href: "/reminders", label: "Reminders", note: "9 scheduled · push + telegram" },
  { href: "#", label: "Connected devices", note: "Add Apple Watch / Garmin / Whoop" },
  { href: "#", label: "Diet preferences", note: "Omnivore · no allergens" },
  { href: "#", label: "Goals & program", note: "Recomp · 84 days · day 12" },
  { href: "#", label: "Units", note: "Metric (kg, cm, °C)" },
];

export default function Profile() {
  return (
    <div>
      <Header title="Gaja" subtitle="Member · Pulse Pro" />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-readiness/40 to-sleep/30 border border-ink-300/60 flex items-center justify-center text-[24px] font-light tracking-tightest">
              G
            </div>
            <div>
              <div className="text-[18px]">Gaja</div>
              <div className="text-[11px] text-bone-mute">Day 12 of 84 · Recomp</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 text-center">
            <Stat label="Streak" v="14" unit="days" />
            <Stat label="Workouts" v="9" unit="this wk" />
            <Stat label="Adherence" v="92" unit="%" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card overflow-hidden">
          {rows.map((r, i) => (
            <Link key={r.label} href={r.href} className={`flex items-center justify-between px-5 py-4 ${i ? "border-t border-ink-300/60" : ""}`}>
              <div>
                <div className="text-[14px]">{r.label}</div>
                <div className="text-[11px] text-bone-mute mt-0.5">{r.note}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6b72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 text-center">
        <div className="text-[10px] text-bone-mute uppercase tracking-[0.25em]">Pulse · v0.1 preview</div>
      </div>
    </div>
  );
}

function Stat({ label, v, unit }: { label: string; v: string; unit: string }) {
  return (
    <div className="bg-ink-100 rounded-2xl py-3 border border-ink-300/60">
      <div className="text-[20px] tabular font-light tracking-tightest">{v}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute mt-1">{label}</div>
      <div className="text-[9px] text-bone-mute mt-0.5">{unit}</div>
    </div>
  );
}
