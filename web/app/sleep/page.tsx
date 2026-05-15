import Header from "@/components/Header";
import { Ring } from "@/components/Ring";
import { Sparkline, SleepStages } from "@/components/Charts";
import { hrvSeries, readiness, rhrSeries, sleepStages } from "@/lib/mockData";

export default function Sleep() {
  const total = sleepStages.reduce((s, x) => s + x.minutes, 0);
  const deep = sleepStages.filter((s) => s.stage === "deep").reduce((s, x) => s + x.minutes, 0);
  const rem = sleepStages.filter((s) => s.stage === "rem").reduce((s, x) => s + x.minutes, 0);
  const light = sleepStages.filter((s) => s.stage === "light").reduce((s, x) => s + x.minutes, 0);
  const awake = sleepStages.filter((s) => s.stage === "awake").reduce((s, x) => s + x.minutes, 0);

  const hrs = Math.floor(total / 60);
  const mins = total % 60;

  return (
    <div>
      <Header title="Last night" subtitle="Sleep · 23:11 → 07:08" />

      <div className="px-5 mt-2">
        <div className="card p-5 flex items-center gap-5">
          <div className="relative">
            <Ring size={132} stroke={10} value={86} color="#8aa2d8" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Score</div>
              <div className="text-[44px] font-light tracking-tightest leading-none mt-1">86</div>
              <div className="text-[10px] text-bone-mute mt-1">solid</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Duration</div>
            <div className="text-[34px] font-light tracking-tightest tabular leading-none mt-1">{hrs}h {mins}m</div>
            <div className="text-[11px] text-bone-mute mt-2">Goal 7h 30m · <span className="text-readiness">on target</span></div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3">Stages</div>
          <div className="grid grid-cols-[40px_1fr] gap-y-1 items-center text-[10px] text-bone-mute">
            <span>Awake</span><div><SleepStages segments={sleepStages} /></div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4 text-[11px]">
            <StageStat label="Deep" m={deep} color="#5b73a8" />
            <StageStat label="REM" m={rem} color="#b8a4d4" />
            <StageStat label="Light" m={light} color="#8aa2d8" />
            <StageStat label="Awake" m={awake} color="#3a3a44" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">HRV · 7d</div>
          <div className="text-[24px] font-light tabular tracking-tightest mt-1">{readiness.hrv}<span className="text-bone-mute text-[11px] ml-1">ms</span></div>
          <div className="mt-2"><Sparkline values={hrvSeries} color="#b8a4d4" height={48} /></div>
          <div className="text-[11px] text-readiness mt-1">↑ improving</div>
        </div>
        <div className="card p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">RHR · 7d</div>
          <div className="text-[24px] font-light tabular tracking-tightest mt-1">{readiness.rhr}<span className="text-bone-mute text-[11px] ml-1">bpm</span></div>
          <div className="mt-2"><Sparkline values={rhrSeries} color="#8aa2d8" height={48} /></div>
          <div className="text-[11px] text-readiness mt-1">↓ improving</div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3">Vitals</div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[12px]">
            <Vital label="Respiration" v={`${readiness.resp}`} unit="br/min" />
            <Vital label="SpO₂" v={`${readiness.spo2}`} unit="%" />
            <Vital label="Skin temp Δ" v={`+${readiness.skinTempDelta}`} unit="°C" />
            <Vital label="Restfulness" v="92" unit="%" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Tonight's recommendation</div>
          <div className="text-[15px] mt-2 leading-relaxed text-bone-dim">
            Wind down by <span className="text-bone">22:50</span>. Target bedtime <span className="text-bone">23:20</span> for a 7h 30m sleep window.
          </div>
        </div>
      </div>
    </div>
  );
}

function StageStat({ label, m, color }: { label: string; m: number; color: string }) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-bone-mute uppercase tracking-[0.15em] text-[10px]">{label}</span>
      </div>
      <div className="text-[14px] tabular mt-1">{h > 0 ? `${h}h ${mm}m` : `${mm}m`}</div>
    </div>
  );
}

function Vital({ label, v, unit }: { label: string; v: string; unit: string }) {
  return (
    <div>
      <div className="text-bone-mute uppercase tracking-[0.2em] text-[10px]">{label}</div>
      <div className="text-[18px] tabular font-light tracking-tightest mt-1">{v}<span className="text-bone-mute text-[10px] ml-1">{unit}</span></div>
    </div>
  );
}
